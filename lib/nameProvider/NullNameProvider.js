var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
/**
 * Name provider that does nothing
 */
function NullNameProvider() {
	EventEmitter.call(this);
}

util.inherits(NullNameProvider, EventEmitter);


/**
 * Update the speak name for the item
 * 
 * @param item			the item to update
 */
NullNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	item.setSpeakName(item.getSpeakName());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}



module.exports = NullNameProvider;