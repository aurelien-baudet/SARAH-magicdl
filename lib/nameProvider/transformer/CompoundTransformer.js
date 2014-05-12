var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
/**
 * Transformer that takes a list of transformers and apply them all
 * 
 * @param transformers			a list of transformers or multiple transformer arguments
 */
function CompoundTransformer(/*Transformer[]|Transformer...*/transformers) {
	transformers = this.transformers = util.isArray(transformers) ? transformers : Array.prototype.slice.call(arguments);
	for(var i=0, l=transformers.length ; i<l ; i++) {
		var f = transformers[i]
		f.on('done', this.done.bind(this));
	}
	this.ctxs = {};
	EventEmitter.call(this);
}

util.inherits(CompoundTransformer, EventEmitter);


/**
 * Transform the name for the item. Delegate the treatment to all compound transformers
 * 
 * @param item			the item to update
 */
CompoundTransformer.prototype.transform = function(/*Item*/item, /*String*/name) {
	this.next(item, name, 0);
}

CompoundTransformer.prototype.next = function(item, name, transformerIdx) {
	if(transformerIdx<this.transformers.length) {
		// store the context
		this.ctxs[item.id] = {transformerIdx: transformerIdx};
		// apply next transformer
		this.transformers[transformerIdx].transform(item, name);
	} else {
		// all transformers have been executed => we are done
		delete this.ctxs[item.id];
		this.emit('done', item, name);
	}
}

CompoundTransformer.prototype.done = function(/*Item*/item, /*String*/name) {
	// previous transformer has ended => try next one
	var ctx = this.ctxs[item.id];
	this.next(item, name, ctx.transformerIdx+1);
}

CompoundTransformer.prototype.setMaxListeners = function(max) {
	EventEmitter.prototype.setMaxListeners.call(this, max);
	for(var i=0, l=this.transformers.length ; i<l ; i++) {
		this.transformers[i].setMaxListeners(max);
	}
}

CompoundTransformer.prototype.toString = function() {
	return "CompoundTransformer["+this.transformers.join(", ")+"]";
}


module.exports = CompoundTransformer;