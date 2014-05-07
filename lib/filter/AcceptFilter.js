var EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Filter that accept all items
 */
function AcceptFilter() {
	EventEmitter.call(this);
}

util.inherits(AcceptFilter, EventEmitter);


/**
 * Check if the item is accepted or rejected
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the fulle list of items
 */
AcceptFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	setTimeout(this.emit.bind(this, 'accepted', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = AcceptFilter;