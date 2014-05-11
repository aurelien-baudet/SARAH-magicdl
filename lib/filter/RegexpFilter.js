var EventEmitter = require('events').EventEmitter,
	util = require('util');

	
/**
 * Filter that checks acceptance against a regular expression.
 * If the item matches the regular expression, then the item is accepted.
 * Otherwise, the item is rejected.
 * 
 * @param re			the regular expression used to test items. Can be either a string that will be converted to regular expression with optional flags or directly a regular expression
 * @param flags			optional flags for the regular expression if *re* is a string
 */
function RegexpFilter(/*String|RegExp*/re, /*String?*/flags) {
	this.re = typeof re=="string" ? new RegExp(re, flags || "gi") : re;
	EventEmitter.call(this);
}

util.inherits(RegexpFilter, EventEmitter);


/**
 * Check if the item is accepted or rejected
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the full list of items
 */
RegexpFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	// bug in regular expression when using test and g flag => MUST instantiate new RegExp every time
	setTimeout(this.emit.bind(this, new RegExp(this.re).test(item.getName()) ? 'accepted' : 'rejected', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


RegexpFilter.prototype.toString = function() {
	return "RegexpFilter["+this.re+"]";
}

module.exports = RegexpFilter;