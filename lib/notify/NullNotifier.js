var EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Notifier that does nothing and directly triggers done event
 */
function NullNotifier() {
	EventEmitter.call(this);
}

util.inherits(NullNotifier, EventEmitter);

/**
 * Does nothing and directly triggers the done event
 * 
 * @param item
 *            the item to notify
 * @event done when the notification has been sent
 */
NullNotifier.prototype.notify = function(/*Item*/item) {
	setTimeout(this.emit.bind(this, 'done', item));
}


module.exports = NullNotifier;