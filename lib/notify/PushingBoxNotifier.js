var http = require('http'),
	string = require('../util/string'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Notifier that uses PushingBox to send a notification
 * 
 * @param deviceId			the PushingBox device id
 * @param title				the title of the notification
 * @param message			the message of the notification
 */
function PushingBoxNotifier(/*String*/deviceId, /*String*/title, /*String*/message) {
	this.deviceId = deviceId;
	this.title = title;
	this.message = message;
	EventEmitter.call(this);
}

util.inherits(PushingBoxNotifier, EventEmitter);

/**
 * Calls PushngBox API to notify a device about the state of the item
 * 
 * @param item				the item used in the notification
 */
PushingBoxNotifier.prototype.notify = function(/*Item*/item) {
	var url = 'http://api.pushingbox.com/pushingbox?devid=' + this.deviceId + '&title=' + encodeURIComponent(string.substitute(this.title, item)) + '&message=' + encodeURIComponent(string.substitute(this.message, item));
	http.get(url, this.emit.bind(this, 'done', item)).on('error', this.emit.bind(this, 'error', item));
}


module.exports = PushingBoxNotifier;