var request = require('request'),
	Item = require('../Item'),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	cheerio = require('cheerio');


/**
 * Search that uses cheerio to parse a simple html page
 * 
 * @param url					the site url
 * @param itemSelector			selector string to access each item
 * @param itemParser			a function used to parse the html content and return an Item
 */
function SiteSearch(/*String*/url, /*String*/itemSelector, /*Function*/itemParser) {
	this.url = url;
	this.itemSelector = itemSelector;
	this.itemParser = itemParser;
	EventEmitter.call(this);
}


util.inherits(SiteSearch, EventEmitter);


/**
 * Start the search
 */
SiteSearch.prototype.search = function() {
	request(this.url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			var htmlItems = $(this.itemSelector);
			var items = [];
			for(var i=0, l=htmlItems.length ; i<l ; i++) {
				var item = $(htmlItems[i]);
				items.push(this.itemParser($, item));
			}
			this.emit('done', items);
		} else {
			console.error("failed to search on site", error, response);
		}
	}.bind(this));
}

SiteSearch.prototype.toString = function() {
	return "SiteSearch[url="+this.url+"]";
}


module.exports = SiteSearch;