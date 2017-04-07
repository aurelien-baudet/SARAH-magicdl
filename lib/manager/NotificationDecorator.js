var util = require('util'),
	winston = require('winston');

/**
 * Base class that helps for initialization and define default behavior
 * 
 * @param manager				the decorated manager
 * @param notifiers				a map that contains the notifiers to trigger for each step
 */
function NotificationDecorator(/*Manager*/manager, /*Notifier{}*/notifiers) {
	this.manager = manager;
	this.notifiers = notifiers;
}


/**
 * Register events and connect them to each point of the algorithm
 */
NotificationDecorator.prototype.register = function(/*Manager?*/manager) {
	manager = manager || this;
	this.manager.register(manager);
	this.manager.on("nothing", this.notifyNothing.bind(this));
	this.notify("register");
}

/**
 * Start the full process
 */
NotificationDecorator.prototype.run = function() {
	this.manager.run();
	this.notify("run");
}


/**
 * Fired when the search has ended
 * 
 * @param items		the found items
 */
NotificationDecorator.prototype.searchDone = function(/*Item[]*/items) {
	this.manager.searchDone(items);
	this.notify("searchDone", items);
}

/**
 * Start the filter on the provided item
 * 
 * @param item			the item to check if it is accepted or rejected
 */
NotificationDecorator.prototype.startFilter = function(/*Item*/item) {
	this.manager.startFilter(item);
	this.notify("startFilter", item);
}

/**
 * Fired when the item is accepted
 * 
 * @param item			the accepted item
 */
NotificationDecorator.prototype.accepted = function(/*Item*/item) {
	this.manager.accepted(item);
	this.notify("accepted", item);
}


/**
 * Fired when the item is rejected
 * 
 * @param item			the rejected item
 */
NotificationDecorator.prototype.rejected = function(/*Item*/item) {
	this.manager.rejected(item);
	this.notify("rejected", item);
}


/**
 * Fired when all items are rejected
 */
NotificationDecorator.prototype.notifyNothing = function() {
	this.notify("nothing");
}


/**
 * Start the download for the provided item
 * 
 * @param item			the item to download
 */
NotificationDecorator.prototype.startDownload = function(/*Item*/item) {
	this.manager.startDownload(item);
	this.notify("startDownload", item);
}


/**
 * Fired when the download is started for the provided item
 * 
 * @param item			the item currently downloading
 */
NotificationDecorator.prototype.downloadStarted = function(/*Item*/item) {
	this.manager.downloadStarted(item);
	this.notify("downloadStarted", item);
}


/**
 * Fired when the download of the item is completed
 * 
 * @param item		the downloaded item
 */
NotificationDecorator.prototype.downloaded = function(/*Item*/item) {
	this.manager.downloaded(item);
	this.notify("downloaded", item);
}


/**
 * Play the item
 * 
 * @param item		the item to play
 */
NotificationDecorator.prototype.play = function(/*Item*/item) {
	this.manager.play(item);
	this.notify("play", item);
}


/**
 * Get the download progress
 */
NotificationDecorator.prototype.downloadProgress = function() {
	this.manager.downloadProgress();
	this.notify("downloadProgress");
}


/**
 * Fired when the progress is available
 */
NotificationDecorator.prototype.currentProgress = function(/*Progress[]*/progressList) {
	this.manager.currentProgress(progressList);
	this.notify("currentProgress", progressList);
}

NotificationDecorator.prototype.notify = function(/*String*/name, /*Object*/context) {
//	winston.log("debug", "notify "+name);
	var notifier = this.notifiers[name];
	if(notifier) {
		notifier.notify(context);
	}
}



NotificationDecorator.prototype.toString = function() {
	return __filename.replace(__dirname, "").replace(/^\/.*\.js$/, "")+" ["+this.manager.toString()+"]";
}

module.exports = NotificationDecorator;