var EventEmitter = require('events').EventEmitter,
	util = require('util');

/**
 * Name provider that simply remove spaces at start and end of the name
 */
function TrimNameProvider() {
	EventEmitter.call(this);
}

util.inherits(TrimNameProvider, EventEmitter);


/**
 * Update the speak name for the item
 * 
 * @param item			the item to update
 */
TrimNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	item.setSpeakName(item.getSpeakName().trim());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}



module.exports = TrimNameProvider;