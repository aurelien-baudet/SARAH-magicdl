var duration = require('../util/duration');


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
 * @param notifiers			a map that contains the different notifiers
 */
function BaseManager(/*Object*/sarahContext, /*Searcher*/searcher, /*Filter*/filter, /*NameProvider*/nameProvider, /*UrlProvider*/urlProvider, /*Downloader*/downloader, /*Player*/player, /*Notifier{}*/notifiers) {
	this.sarahContext = sarahContext;
	this.searcher = searcher;
	this.filter = filter;
	this.nameProvider = nameProvider;
	this.urlProvider = urlProvider;
	this.downloader = downloader;
	this.player = player;
	this.notifiers = notifiers;
}

/**
 * Start the full process
 */
BaseManager.prototype.run = function() {
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


module.exports = BaseManager