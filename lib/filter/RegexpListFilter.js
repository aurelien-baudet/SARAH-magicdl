var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	RegexpFilter = require("./RegexpFilter");

	
function RegexpListFilter(regexps) {
	this.regexps = [];
	for(var i=0, l=regexps.length ; i<l ; i++) {
		var re = regexps[i];
		this.regexps.push(new RegexpFilter(re.regexp, re.flags));
	}
}

util.inherits(RegexpListFilter, EventEmitter);

RegexpListFilter.prototype.accept = function(item, idx, items) {
	var idx = 0;
	// register events on each sub filter
	for(var i=0, l=this.regexps.length ; i<l ; i++) {
		this.regexps[i].removeAllListeners();
		this.regexps[i].once('accepted', function(item) {
			idx++;
			// if one filter is accepted => stop now and trigger accepted event
			this.emit('accepted', item);
			this.emit('done', item);
		}.bind(this));
		
		this.regexps[i].once('rejected', function(item) {
			idx++;
			// if there still have filters => start the next one
			// else => reject the item
			if(idx<this.regexps.length) {
				this.regexps[idx].accept(item);
			} else {
				this.emit('rejected', item);
				this.emit('done', item);
			}
		}.bind(this));
	}
	// if there are sub filters => start with the first one
	// else => reject the item
	if(this.regexps.length) {
		this.regexps[0].accept(item);
	} else {
		this.emit('rejected', item);
		this.emit('done', item);
	}
}


RegexpListFilter.prototype.toString = function() {
	return "RegexpListFilter["+this.regexps.join(", ")+"]";
}


module.exports = RegexpListFilter;