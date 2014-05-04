var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
function UnreadFilter(store) {
	this.store = store;
}

util.inherits(UnreadFilter, EventEmitter);


UnreadFilter.prototype.accept = function(item) {
	var accepted = !this.store.exists(item.getUrl());
	this.store.save(item.getUrl(), true);
	setTimeout(this.emit.bind(this, accepted ? 'accepted' : 'rejected', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}

UnreadFilter.prototype.toString = function() {
	return "UnreadFilter["+this.store+"]";
}

module.exports = UnreadFilter;