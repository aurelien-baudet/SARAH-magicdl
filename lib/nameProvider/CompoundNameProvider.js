var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
/**
 * Name provider that takes a list of providers and apply them all
 * 
 * @param providers			a list of providers or multiple provider arguments
 */
function CompoundNameProvider(/*NameProvider[]|NameProvider...*/providers) {
	providers = this.providers = util.isArray(providers) ? providers : Array.prototype.slice.call(arguments);
	for(var i=0, l=providers.length ; i<l ; i++) {
		var f = providers[i];
		f.on('done', this.done.bind(this));
	}
	this.ctxs = {};
	EventEmitter.call(this);
}

util.inherits(CompoundNameProvider, EventEmitter);


/**
 * Update the speak name for the item. Delegate the treatment to all compound providers
 * 
 * @param item			the item to update
 */
CompoundNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	this.next(item, 0);
}

CompoundNameProvider.prototype.next = function(item, providerIdx) {
	if(providerIdx<this.providers.length) {
		// store the context
		this.ctxs[item.id] = {providerIdx: providerIdx};
		// apply next provider
		this.providers[providerIdx].setSpeakName(item);
	} else {
		// all providers have been executed => we are done
		delete this.ctxs[item.id];
		this.emit('done', item);
	}
}

CompoundNameProvider.prototype.done = function(/*Item*/item) {
	// previous provider has ended => try next one
	var ctx = this.ctxs[item.id];
	this.next(item, ctx.providerIdx+1);
}

CompoundNameProvider.prototype.setMaxListeners = function(max) {
	EventEmitter.prototype.setMaxListeners.call(this, max);
	for(var i=0, l=this.providers.length ; i<l ; i++) {
		this.providers[i].setMaxListeners(max);
	}
}

CompoundNameProvider.prototype.toString = function() {
	return "CompoundNameProvider["+this.providers.join(", ")+"]";
}


module.exports = CompoundNameProvider;