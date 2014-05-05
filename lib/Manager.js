var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	winston = require('winston');

function Manager(sarahContext, searcher, filter, nameProvider, urlProvider, downloader, player) {
	this.sarahContext = sarahContext;
	this.searcher = searcher;
	this.filter = filter;
	this.nameProvider = nameProvider;
	this.urlProvider = urlProvider;
	this.downloader = downloader;
	this.player = player;
	EventEmitter.call(this);
}


util.inherits(Manager, EventEmitter);


// TODO: manage errors

Manager.prototype.run = function() {
	var foundItems,
		rejected = 0,
		idx = 0;
	// start search
	winston.log("debug", "start searching");
	// call SARAH callback to avoid blocking it
	this.sarahContext.callback({tts: 'Je lance la recherche'});
	this.searcher.search();
	this.searcher.on('done', function(items) {
		winston.log("debug", "search done, found: "+items.length);
		foundItems = items;
		// start filtering
		if(items.length) {
			this.filter.accept(items[idx], idx, items);
		}
	}.bind(this));
	
	this.filter.on('accepted', function(item) {
		winston.log("debug", "item accepted: "+item.getName());
		// get name to speak
		// TODO: call nameProvider and urlProvider in parallel
		this.nameProvider.setSpeakName(item);
	}.bind(this));
	
	this.filter.on('rejected', function(item) {
		winston.log("debug", "item rejected: "+item.getName());
		// if all items are rejected => indicate it
		if(++rejected>=foundItems.length) {
			this.sarahContext.SARAH.speak('Rien à télécharger', function() {});
		}
	}.bind(this));

	this.filter.on('done', function(item) {
		// apply next filter
		if(++idx<foundItems.length) {
			this.filter.accept(foundItems[idx]);
		}
	}.bind(this));

	this.nameProvider.on('done', function(item) {
		winston.log("debug", "set download url for "+item.getName());
		this.urlProvider.setDownloadUrl(item);
	}.bind(this));

	this.urlProvider.on('done', function(item) {
		// start download
		winston.log("debug", "start download for "+item.getName());
		this.downloader.start(item);
	}.bind(this));

	this.downloader.on('started', function(item) {
		winston.log("debug", "item download started "+item.getName());
		this.sarahContext.SARAH.speak(item.getSpeakName()+" en cours de téléchargement", function() {});
	}.bind(this));
	
	this.downloader.on('downloaded', function(item) {
		winston.log("debug", "item downloaded "+item.getName());
		// downloaded => ask for playing
		this.sarahContext.SARAH.askme(item.getSpeakName()+" est téléchargé. Veux-tu le regarder maintenant ?", {
		  "Oui" : "o",
		  "vas-y": "o",
		  "Non" : "",
		  "pas maintenant": ""
		}, 15000, function(answer) {
			if(answer) {
				// TODO: when play is ended ask for next downloaded item ?
				this.player.play(item);
			}
		}.bind(this));
	}.bind(this));
}

Manager.prototype.toString = function() {
	return __filename.replace(__dirname, "").replace(/^\/.*\.js$/, "");
}



module.exports = Manager;