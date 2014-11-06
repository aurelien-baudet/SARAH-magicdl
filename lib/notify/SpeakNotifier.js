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
 * SARAH will speak to notify the user
 * 
 * @param context				the context for notification
 */
SpeakNotifier.prototype.notify = function(/*Object*/context) {
	this.sarahContext.SARAH.speak(string.substitute(this.message, context), this.emit.bind(this, 'done', context));
}


module.exports = SpeakNotifier;