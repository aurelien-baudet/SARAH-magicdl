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
 * @param context				the context for notification
 * @event done when the notification has been sent
 */
NullNotifier.prototype.notify = function(/*Object*/context) {
	setTimeout(this.emit.bind(this, 'done', context));
}


module.exports = NullNotifier;