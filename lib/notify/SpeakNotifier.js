var string = require('../util/string'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

/**
 * Notifier that uses SARAH to tell what happens
 * 
 * @param sarahContext		the SARAH context (references to SARAH, callback, config, data, directory, downloadConf, managerConf)
 * @param message			the message that SARAH will tell
 */
function SpeakNotifier(/*Object*/sarahContext, /*String*/message) {
	this.sarahContext = sarahContext;
	this.message = message;
	EventEmitter.call(this);
}

util.inherits(SpeakNotifier, EventEmitter);

/**
 * SARAH will tell which item is notified for
 * 
 * @param item				the item to notify
 */
SpeakNotifier.prototype.notify = function(/*Item*/item) {
	this.sarahContext.SARAH.speak(string.substitute(this.message, item), this.emit.bind(this, 'done', item));
}


module.exports = SpeakNotifier;