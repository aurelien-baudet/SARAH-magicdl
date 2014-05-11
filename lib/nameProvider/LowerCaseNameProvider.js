var EventEmitter = require('events').EventEmitter,
	util = require('util');

/**
 * Name provider that simply force lower case for speak name
 */
function LowerCaseNameProvider() {
	EventEmitter.call(this);
}

util.inherits(LowerCaseNameProvider, EventEmitter);


/**
 * Update the speak name for the item
 * 
 * @param item			the item to update
 */
LowerCaseNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	item.setSpeakName(item.getSpeakName().toLowerCase());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}



module.exports = LowerCaseNameProvider;