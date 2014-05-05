var EventEmitter = require('events').EventEmitter,
	util = require('util');

	
function AcceptFilter() {
}

util.inherits(AcceptFilter, EventEmitter);


AcceptFilter.prototype.accept = function(item, idx, items) {
	setTimeout(this.emit.bind(this, 'accepted', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = AcceptFilter;