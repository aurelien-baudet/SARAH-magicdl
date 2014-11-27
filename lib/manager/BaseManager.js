var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	duration = require('../util/duration'),
	winston = require('winston');


/**
 * Base class that helps for initialization and define default behavior
 * 
 * @param sarahContext		the SARAH context (references to SARAH, callback, config, data, directory, downloadConf, managerConf)
 * @param searcher			the searcher instance to use
 * @param filter			the filter instance to use
 * @param nameProvider		the name provider instance to use
 * @param urlProvider		the url provider instance to use
 * @param downloader		the downloader instance to use
 * @param player			the player instance to use
 */
function BaseManager(/*Object*/sarahContext, /*Searcher*/searcher, /*Filter*/filter, /*NameProvider*/nameProvider, /*UrlProvider*/urlProvider, /*Downloader*/downloader, /*Player*/player) {
	this.sarahContext = sarahContext;
	this.searcher = searcher;
	this.filter = filter;
	this.nameProvider = nameProvider;
	this.urlProvider = urlProvider;
	this.downloader = downloader;
	this.player = player;
}

util.inherits(BaseManager, EventEmitter);


/**
 * Register events and connect them to each point of the algorithm
 */
BaseManager.prototype.register = function() {
	throw new Error("Abstract");
}

/**
 * Start the full process
 */
BaseManager.prototype.run = function() {
	throw new Error("Abstract");
}


/**
 * Fired when the search has ended
 * 
 * @param items		the found items
 */
BaseManager.prototype.searchDone = function(/*Item[]*/items) {
	throw new Error("Abstract");
}

/**
 * Start the filter on the provided item
 * 
 * @param item			the item to check if it is accepted or rejected
 */
BaseManager.prototype.startFilter = function(/*Item*/item) {
	throw new Error("Abstract");
}

/**
 * Fired when the item is accepted
 * 
 * @param item			the accepted item
 */
BaseManager.prototype.accepted = function(/*Item*/item) {
	throw new Error("Abstract");
}


/**
 * Fired when the item is rejected
 * 
 * @param item			the rejected item
 */
BaseManager.prototype.rejected = function(/*Item*/item) {
	throw new Error("Abstract");
}


/**
 * Fired when all items are rejected
 */
BaseManager.prototype.nothing = function() {
	winston.log("info", "nothing to download");
	this.emit("nothing");
}


/**
 * Start the download for the provided item
 * 
 * @param item			the item to download
 */
BaseManager.prototype.startDownload = function(/*Item*/item) {
	throw new Error("Abstract");
}


/**
 * Fired when the download is started for the provided item
 * 
 * @param item			the item currently downloading
 */
BaseManager.prototype.downloadStarted = function(/*Item*/item) {
	throw new Error("Abstract");
}


/**
 * Fired when the download of the item is completed
 * 
 * @param item		the downloaded item
 */
BaseManager.prototype.downloaded = function(/*Item*/item) {
	throw new Error("Abstract");
}


/**
 * Play the item
 * 
 * @param item		the item to play
 */
BaseManager.prototype.play = function(/*Item*/item) {
	throw new Error("Abstract");
}


/**
 * Get the download progress
 */
BaseManager.prototype.downloadProgress = function() {
	this.downloader.progress();
}

/**
 * Fired when the progress is available
 */
BaseManager.prototype.currentProgress = function(/*Progress[]*/progressList) {
	console.log("current progress");
	for(var i=0, l=progressList.length ; i<l ; i++) {
		var p = progressList[i];
		if(p.getPercent()<100) {
			this.sarahContext.SARAH.speak(p.getItem().getSpeakName()+" est téléchargé à "+p.getPercent()+" pourcent. Il sera prêt dans "+duration.format(p.getRemainingTime()), function() {});
		} else {
			// TODO: ask for playing ?
			this.sarahContext.SARAH.speak(p.getItem().getSpeakName()+" est téléchargé", function() {});
		}
	}
}


BaseManager.prototype.toString = function() {
	return __filename.replace(__dirname, "").replace(/^\/.*\.js$/, "");
}


module.exports = BaseManager;