var EventEmitter = require('events').EventEmitter,
	util = require('util');


function AndFilter(filters) {
	this.filters = util.isArray(filters) ? filters : Array.prototype.slice.call(arguments);
}

util.inherits(AndFilter, EventEmitter);


AndFilter.prototype.accept = function(item, idx, items) {
	var idx = 0;
	// register events on each sub filter
	for(var i=0, l=this.filters.length ; i<l ; i++) {
		this.filters[i].removeAllListeners();
		this.filters[i].once('accepted', function(item) {
			idx++;
			// if there still have filters => start the next one
			// else <-> all sub filters are accepted => accept the item
			if(idx<this.filters.length) {
				this.filters[idx].accept(item);
			} else {
				this.emit('accepted', item);
				this.emit('done', item);
			}
		}.bind(this));
		
		this.filters[i].once('rejected', function(item) {
			idx++;
			// if one filter is rejected => stop now and trigger rejected event
			this.emit('rejected', item);
			this.emit('done', item);
		}.bind(this));
	}
	// if there are sub filters => start with the first one
	// else => reject the item
	if(this.filters.length) {
		this.filters[0].accept(item);
	} else {
		this.emit('rejected', item);
		this.emit('done', item);
	}
}

AndFilter.prototype.toString = function() {
	return "AndFilter["+this.filters.join(", ")+"]";
}


module.exports = AndFilter;