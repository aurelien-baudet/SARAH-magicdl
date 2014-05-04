var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
function RegexpNameProvider(regexp, replacement) {
	this.re = regexp;
	this.replacement = replacement || "$1";
	EventEmitter.call(this);
}

util.inherits(RegexpNameProvider, EventEmitter);

RegexpNameProvider.prototype.setSpeakName = function(item) {
	item.setSpeakName(item.getName().replace(this.re, this.replacement));
	setTimeout(this.emit.bind(this, 'done', item), 0);
}

RegexpNameProvider.prototype.toString = function() {
	return "RegexpNameProvider[re="+this.re+", replacement="+this.replacement+"]";
}


module.exports = RegexpNameProvider;