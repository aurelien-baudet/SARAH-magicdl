var EventEmitter = require('events').EventEmitter,
	util = require('util');

	
function RegexpFilter(re, flags) {
	this.re = new RegExp(re, flags || "gi");
}

util.inherits(RegexpFilter, EventEmitter);


RegexpFilter.prototype.accept = function(item) {
	setTimeout(this.emit.bind(this, this.re.test(item.getName()) ? 'accepted' : 'rejected', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


RegexpFilter.prototype.toString = function() {
	return "RegexpFilter["+this.re+"]";
}

module.exports = RegexpFilter;