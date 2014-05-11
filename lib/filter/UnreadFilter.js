var EventEmitter = require('events').EventEmitter,
	util = require('util');
	

/**
 * Filter that checks into the provided store if the items have already been read or not.
 * If the item is not read (not present in the store), then the item is accepted.
 * Once the item is accepted, it is added into the store.
 * If the item is already in the store, then the item is rejected.
 * The item is stored by using the url.
 * 
 * @param store			the store used to save the read items
 */
function UnreadFilter(/*Store*/store) {
	this.store = store;
	EventEmitter.call(this);
}

util.inherits(UnreadFilter, EventEmitter);


/**
 * Check if the item is accepted or rejected
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the full list of items
 */
UnreadFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	var accepted = !this.store.exists(item.getUrl());
	this.store.save(item.getUrl(), true);
	setTimeout(this.emit.bind(this, accepted ? 'accepted' : 'rejected', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}

UnreadFilter.prototype.toString = function() {
	return "UnreadFilter["+this.store+"]";
}

module.exports = UnreadFilter;