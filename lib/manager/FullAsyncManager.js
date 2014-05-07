var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	winston = require('winston');


/**
 * Base manager that execute all actions asynchronously. The aim is to start downloading item as soon as it is ready.
 * The algorithm is:
 *     - search
 *     - for each found item:
 *         - set the speak name
 *         - once the speak name for an item is set, start filtering on this item
 *         - once the filter is accepted on this item, set the download url
 *         - once the download url is set on this item, start downloading
 *         - once the item is downloaded, play it
 * 
 * @param sarahContext		the SARAH context (references to SARAH, callback, config, data, directory, downloadConf, managerConf)
 * @param searcher			the searcher instance to use
 * @param filter			the filter instance to use
 * @param nameProvider		the name provider instance to use
 * @param urlProvider		the url provider instance to use
 * @param downloader		the downloader instance to use
 * @param player			the player instance to use
 */
function FullAsyncManager(/*Object*/sarahContext, /*Searcher*/searcher, /*Filter*/filter, /*NameProvider*/nameProvider, /*UrlProvider*/urlProvider, /*Downloader*/downloader, /*Player*/player) {
	this.sarahContext = sarahContext;
	this.searcher = searcher;
	this.filter = filter;
	this.nameProvider = nameProvider;
	this.urlProvider = urlProvider;
	this.downloader = downloader;
	this.player = player;
	EventEmitter.call(this);
	this.register();
}


util.inherits(FullAsyncManager, EventEmitter);

/**
 * Register events and connect them to each point of the algorithm
 */
FullAsyncManager.prototype.register = function() {
	this.searcher.on('done', this.searchDone.bind(this));

	// filtering found items
	this.nameProvider.on('done', this.startFilter.bind(this));
	this.filter.on('accepted', this.accepted.bind(this));
	this.filter.on('rejected', this.rejected.bind(this));

	// start download
	this.urlProvider.on('done', this.startDownload.bind(this));
	this.downloader.on('started', this.downloadStarted.bind(this));
	this.downloader.on('downloaded', this.downloaded.bind(this));
}

/**
 * Start the full process
 */
// TODO: manage errors
FullAsyncManager.prototype.run = function() {
	this.numRejected = 0;
	// call SARAH callback to avoid blocking it
	this.sarahContext.callback({tts: 'Je lance la recherche'});
	
	// start search
	winston.log("debug", "start searching");
	this.searcher.search();
}

/**
 * Fired when the search has ended. Start setting speak names on every found items
 * 
 * @param items		the found items
 */
FullAsyncManager.prototype.searchDone = function(/*Item[]*/items) {
	winston.log("debug", "search done, found: "+items.length);
	this.foundItems = items;
	// everything is async => all part can be trigger with all found items in the same time => need to increase max number of listeners
	this.nameProvider.setMaxListeners(items.length);
	this.filter.setMaxListeners(items.length);
	// NOTE: items will be filtered so there may have less found items than search results
	// so we could set the number to the number of accepted items. But if we do so, we are 
	// no more fully async because we wait for the end of the filtering before executing the following
	this.urlProvider.setMaxListeners(items.length);
	this.downloader.setMaxListeners(items.length);
	for(var i=0, l=items.length ; i<l ; i++) {
		this.nameProvider.setSpeakName(items[i]);
	}
}

/**
 * Start the filter on the provided item
 * 
 * @param item			the item to check if it is accepted or rejected
 */
FullAsyncManager.prototype.startFilter = function(/*Item*/item) {
	winston.log("debug", "apply filter on "+item.getName());
	this.filter.accept(item, this.foundItems.indexOf(item), this.foundItems);
}

/**
 * Fired when the item is accepted. Start setting the download url
 * 
 * @param item			the accepted item
 */
FullAsyncManager.prototype.accepted = function(/*Item*/item) {
	winston.log("debug", "item accepted: "+item.getName());
	// get name to speak
	// TODO: call nameProvider and urlProvider in parallel
	this.urlProvider.setDownloadUrl(item);
}


/**
 * Fired when the item is rejected. If all found items have been rejected, then tell it to the user
 * 
 * @param item			the rejected item
 */
FullAsyncManager.prototype.rejected = function(/*Item*/item) {
	winston.log("debug", "item rejected: "+item.getName());
	// if all items are rejected => indicate it
	if(++this.numRejected>=this.foundItems.length) {
		this.sarahContext.SARAH.speak('Rien à télécharger', function() {});
	}
}

/**
 * Start the download for the provided item
 * 
 * @param item			the item to download
 */
FullAsyncManager.prototype.startDownload = function(/*Item*/item) {
	// start download
	winston.log("debug", "start download for "+item.getName());
	this.downloader.start(item);
}


/**
 * Fired when the download is started for the provided item. Tell it to the user
 * 
 * @param item			the item currently downloading
 */
FullAsyncManager.prototype.downloadStarted = function(/*Item*/item) {
	winston.log("debug", "item download started "+item.getName());
	this.sarahContext.SARAH.speak(item.getSpeakName()+" en cours de téléchargement", function() {});
}


/**
 * Fired when the download of the item is completed. Ask the user to play it. If user accepts it, the start playing
 * 
 * @param item		the downloaded item
 */
FullAsyncManager.prototype.downloaded = function(/*Item*/item) {
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
FullAsyncManager.prototype.play = function(/*Item*/item) {
	winston.log("debug", "start playing "+item.getName());
	// TODO: when play is ended ask for next downloaded item ?
	this.player.play(item);
}

FullAsyncManager.prototype.toString = function() {
	return __filename.replace(__dirname, "").replace(/^\/.*\.js$/, "");
}



module.exports = FullAsyncManager;