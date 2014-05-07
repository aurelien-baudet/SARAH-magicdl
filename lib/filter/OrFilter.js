var EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Logical OR filter. Takes a list of filters and run them one by one to check if they all
 * reject the item. If one accepts the item then the item is immediately accepted
 * 
 * @param filters			either a list of filters or multiple filter arguments
 */
function OrFilter(/*Filter[]|Filter...*/filters) {
	filters = this.filters = util.isArray(filters) ? filters : Array.prototype.slice.call(arguments);
	for(var i=0, l=filters.length ; i<l ; i++) {
		var f = filters[i]
		f.on('accepted', this.accepted.bind(this));
		f.on('rejected', this.rejected.bind(this));
	}
	this.ctxs = {};
	EventEmitter.call(this);
}

util.inherits(OrFilter, EventEmitter);


/**
 * Check if the item is accepted or rejected
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the fulle list of items
 */
OrFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	this.next(item, idx, items, 0);
}


OrFilter.prototype.next = function(item, idx, items, filterIdx) {
	// if there still have sub filters to apply => start it
	// else (all sub filters have been executed) <-> no sub filter has accepted the item => reject the item
	if(filterIdx<this.filters.length) {
		// store the context
		this.ctxs[item.id] = {idx: idx, items: items, filterIdx: filterIdx};
		// apply next filter
		this.filters[filterIdx].accept(item, idx, items);
	} else {
		// reject the item
		delete this.ctxs[item.id];
		this.emit('rejected', item);
		this.emit('done', item);
	}
}

OrFilter.prototype.accepted = function(/*Item*/item) {
	// item is accepted by previous sub filter => stop now and reject the item
	delete this.ctxs[item.id];
	this.emit('accepted', item);
	this.emit('done', item);
}

OrFilter.prototype.rejected = function(/*Item*/item) {
	// item is rejected by previous sub filter => try next sub filter
	var ctx = this.ctxs[item.id];
	this.next(item, ctx.idx, ctx.items, ctx.filterIdx+1);
}


OrFilter.prototype.setMaxListeners = function(max) {
	EventEmitter.prototype.setMaxListeners.call(this, max);
	for(var i=0, l=this.filters.length ; i<l ; i++) {
		this.filters[i].setMaxListeners(max);
	}
}


OrFilter.prototype.toString = function() {
	return "OrFilter["+this.filters.join(", ")+"]";
}


module.exports = OrFilter;