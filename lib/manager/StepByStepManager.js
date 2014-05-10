var BaseManager = require('./BaseManager'),
	util = require('util'),
	winston = require('winston');

/**
 * Base manager that execute actions sequentially.
 * The algorithm is:
 *     - search
 *     - set speak name for all found items
 *     - filter all found items
 *     - set download url for all accepted items
 *     - start downloading for all accepted items
 *     - once an item is downloaded, play it
 * 
 * @param sarahContext		the SARAH context (references to SARAH, callback, config, data, directory, downloadConf, managerConf)
 * @param searcher			the searcher instance to use
 * @param filter			the filter instance to use
 * @param nameProvider		the name provider instance to use
 * @param urlProvider		the url provider instance to use
 * @param downloader		the downloader instance to use
 * @param player			the player instance to use
 */
function StepByStepManager(/*Object*/sarahContext, /*Searcher*/searcher, /*Filter*/filter, /*NameProvider*/nameProvider, /*UrlProvider*/urlProvider, /*Downloader*/downloader, /*Player*/player) {
	BaseManager.call(this, sarahContext, searcher, filter, nameProvider, urlProvider, downloader, player);
	this.register();
}


util.inherits(StepByStepManager, BaseManager);


/**
 * Register events and connect them to each point of the algorithm
 */
StepByStepManager.prototype.register = function() {
	this.searcher.on('done', this.searchDone.bind(this));

	// filtering found items
	this.nameProvider.on('done', this.startFilter.bind(this));
	this.filter.on('accepted', this.accepted.bind(this));
	this.filter.on('rejected', this.rejected.bind(this));
	this.filter.on('done', this.setDownloadUrls.bind(this));

	// start download
	this.urlProvider.on('done', this.startDownload.bind(this));
	this.downloader.on('started', this.downloadStarted.bind(this));
	this.downloader.on('downloaded', this.downloaded.bind(this));
}


/**
 * Start the full process
 */
// TODO: manage errors
StepByStepManager.prototype.run = function() {
	// call SARAH callback to avoid blocking it
	this.sarahContext.callback({tts: 'Je lance la recherche'});

	// start search
	winston.log("debug", "start searching");
	this.searcher.search();
}


/**
 * Fired when the search has ended. Start setting speak name on first found item
 * 
 * @param items		the found items
 */
StepByStepManager.prototype.searchDone = function(/*Item[]*/items) {
	winston.log("debug", "search done, found: "+items.length);
	this.rejected = 0;
	this.accepted = [],
	this.idx = 0;
	this.foundItems = items;
	// get name to speak if there are some items
	if(items.length) {
		winston.log("debug", "set name for "+items[0].getName());
		this.nameProvider.setSpeakName(items[0]);
	}
}


/**
 * If there are still items without speak name, then start setting next speak name.
 * If all items have their speak name set, then start filtering on first item
 * 
 * @param item			the item to either set speak name or start filtering
 */
StepByStepManager.prototype.startFilter = function(/*Item*/item) {
	winston.log("debug", "speak name for "+this.foundItems[this.idx].getName()+"  ->  "+this.foundItems[this.idx].getSpeakName());
	// get name to speak for every item and then start filtering
	if(++this.idx<this.foundItems.length) {
		winston.log("debug", "set name for "+this.foundItems[this.idx].getName());
		this.nameProvider.setSpeakName(this.foundItems[this.idx]);
	} else {
		this.idx = 0;
		winston.log("debug", "apply filter on: "+this.foundItems[this.idx].getName());
		this.filter.accept(this.foundItems[this.idx], this.idx, this.foundItems);
	}
}


/**
 * Fired when the item is accepted. Save it until all filters have been applied
 * 
 * @param item			the accepted item
 */
StepByStepManager.prototype.accepted = function(/*Item*/item) {
	winston.log("debug", "item accepted: "+item.getName());
	this.accepted.push(item);
}


/**
 * Fired when the item is rejected. If all found items have been rejected, then tell it to the user
 * 
 * @param item			the rejected item
 */
StepByStepManager.prototype.rejected = function(/*Item*/item) {
	winston.log("debug", "item rejected: "+item.getName());
	// if all items are rejected => indicate it
	if(++this.rejected>=this.foundItems.length) {
		this.sarahContext.SARAH.speak('Rien à télécharger', function() {});
	}
}


/**
 * Fired when a filter has been applied. Check if all items have been filtered.
 * If all items have been filtered, then start setting download url.
 * If there are still some items to filter, then filter the next one
 * 
 * @param item			the filtered item
 */
StepByStepManager.prototype.setDownloadUrls = function(/*Item*/item) {
	// apply next filter
	if(++this.idx<this.foundItems.length) {
		winston.log("debug", "apply filter on: "+this.foundItems[this.idx].getName());
		this.filter.accept(this.foundItems[this.idx], this.idx, this.foundItems);
	} else {
		// start finding url
		this.idx = 0;
		this.urlProvider.setDownloadUrl(this.accepted[this.idx]);
	}
}


/**
 * Fired when a download url has been set.
 * If all items have their download url set, then start downloading the first item.
 * If there are still some items without download url, then start setting the download url on the next one
 * 
 * @param item			the item to download
 */
StepByStepManager.prototype.startDownload = function(/*Item*/item) {
	if(++this.idx<this.accepted.length) {
		this.urlProvider.setDownloadUrl(this.accepted[this.idx]);
	} else {
		// start download
		winston.log("debug", "start download for "+item.getName());
		this.idx = 0;
		this.downloader.start(item);
	}
}


/**
 * Fired when the download is started for the provided item. Tell it to the user and if
 * there are still items to download, then start the next one
 * 
 * @param item			the item currently downloading
 */
StepByStepManager.prototype.downloadStarted = function(/*Item*/item) {
	winston.log("debug", "item download started "+item.getName());
	this.sarahContext.SARAH.speak(item.getSpeakName()+" en cours de téléchargement", function() {
		if(++this.idx<this.accepted.length) {
			this.downloader.start(this.accepted[this.idx]);
		}
	}.bind(this));
}


/**
 * Fired when the download of the item is completed. Ask the user to play it. If user accepts it, the start playing
 * 
 * @param item		the downloaded item
 */
StepByStepManager.prototype.downloaded = function(/*Item*/item) {
	winston.log("debug", "item downloaded "+item.getName());
	// downloaded => ask for playing
	this.sarahContext.SARAH.askme(item.getSpeakName()+" est téléchargé. Veux-tu le regarder maintenant ?", {
	  "Oui" : "o",
	  "vas-y": "o",
	  "Non" : "",
	  "pas maintenant": ""
	}, 15000, function(answer, end) {
		end();
		if(answer) {
			this.play(item);
		}
	}.bind(this));
}


/**
 * Play the downloaded item
 * 
 * @param item		the item to play
 */
StepByStepManager.prototype.play = function(/*Item*/item) {
	winston.log("debug", "start playing "+item.getName());
	// TODO: when play is ended ask for next downloaded item ?
	this.player.play(item);
}




module.exports = StepByStepManager;