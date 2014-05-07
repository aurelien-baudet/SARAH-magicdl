var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	RegexpFilter = require("./RegexpFilter"),
	OrFilter = require("./OrFilter");

	
/**
 * Filter that delegates acceptance checking to RegexpFilter for each provided regular expression.
 * This class is just another way for writing code.
 * Writing this:
 * <code>
 * new RegexpListFilter({regexp: "Game of thrones.*"}, {regexp: ".*avi$", flags: "gi"});
 * </code>
 * This is equivalent to writing
 * <code>
 * new OrFilter(new RegexpFilter("Game of thrones.*"), new RegexpFilter(".*avi$", "gi")));
 * </code>
 * 
 * @param regexps			either a list of regular expressions or multiple regular expression arguments
 */
function RegexpListFilter(/*Object[]|Object...|Regexp[]|Regexp...*/regexps) {
	regexps = util.isArray(regexps) ? regexps : Array.prototype.slice.call(arguments);
	this.filters = filters = [];
	for(var i=0, l=regexps.length ; i<l ; i++) {
		var re = regexps[i];
		if(re.regexp) {
			filters.push(new RegexpFilter(re.regexp, re.flags));
		} else {
			filters.push(new RegexpFilter(re))
		}
	}
	this.delegate = new OrFilter(filters);
	this.delegate.on('accepted', this.emit.bind(this, 'accepted'));
	this.delegate.on('rejected', this.emit.bind(this, 'rejected'));
	this.delegate.on('done', this.emit.bind(this, 'done'));
	this.ctxs = {};
	EventEmitter.call(this);
}

util.inherits(RegexpListFilter, EventEmitter);

/**
 * Check if the item is accepted or rejected
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the fulle list of items
 */
RegexpListFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	this.delegate.accept(item, idx, items)
}


RegexpListFilter.prototype.toString = function() {
	return "RegexpListFilter["+this.filters.join(", ")+"]";
}


module.exports = RegexpListFilter;