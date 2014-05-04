var EventEmitter = require('events').EventEmitter,
	util = require('util');


function OrFilter(filters) {
	this.filters = filters;
}

util.inherits(OrFilter, EventEmitter);


OrFilter.prototype.accept = function(item) {
	var idx = 0;
	// register events on each sub filter
	for(var i=0, l=this.filters.length ; i<l ; i++) {
		this.filters[i].removeAllListeners();
		this.filters[i].once('accepted', function(item) {
			idx++;
			// if one filter is accepted => stop now and trigger accepted event
			this.emit('accepted', item);
			this.emit('done', item);
		}.bind(this));
		
		this.filters[i].once('rejected', function(item) {
			idx++;
			// if there still have filters => start the next one
			// else <-> no sub filter is accepted => reject the item
			if(idx<this.filters.length) {
				this.filters[idx].accept(item);
			} else {
				this.emit('rejected', item);
				this.emit('done', item);
			}
		}.bind(this));
	}
	// if there are sub filters => start with the first one
	// else => accept the item
	if(this.filters.length) {
		this.filters[0].accept(item);
	} else {
		this.emit('accepted', item);
		this.emit('done', item);
	}
}

module.exports = OrFilter;