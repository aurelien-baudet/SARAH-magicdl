var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
/**
 * Name provider that use a regular expression and an optional replacement to apply on the speak name
 * 
 * @param regexp			the regular expression to apply on the speak name
 * @param replacement		optional replacement to use with the regular expression (default to: "$1")
 */
function RegexpNameProvider(/*String|RegExp*/regexp, /*String?*/replacement) {
	this.re = regexp;
	this.replacement = typeof replacement=="string" ? replacement : "$1";
	EventEmitter.call(this);
}

util.inherits(RegexpNameProvider, EventEmitter);

/**
 * Update the speak name for the item
 * 
 * @param item			the item to update
 */
RegexpNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	item.setSpeakName(item.getSpeakName().replace(this.re, this.replacement));
	setTimeout(this.emit.bind(this, 'done', item), 0);
}

RegexpNameProvider.prototype.toString = function() {
	return "RegexpNameProvider[re="+this.re+", replacement="+this.replacement+"]";
}


module.exports = RegexpNameProvider;