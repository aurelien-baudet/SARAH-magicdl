var FeedParser = require('feedparser'),
	request = require('request'),
	Item = require('../Item'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Search that simply read a RSS feed and provide the found items.
 * 
 * @param url			the RSS url
 */
function RssSearch(/*String*/url) {
	this.url = url;
	EventEmitter.call(this);
}


util.inherits(RssSearch, EventEmitter);


/**
 * Start the search
 */
RssSearch.prototype.search = function() {
	var req = request(this.url),
		feedparser = new FeedParser(),
		items = [],
		controller = this;

	req.on('error', function (error) {
		// handle any request errors
		controller.emit('error', error);
	});
	req.on('response', function (res) {
		if (res.statusCode != 200) return controller.emit('error', new Error('Bad status code'));

		this.pipe(feedparser);
	});
	req.on('end', function() {
		controller.emit('done', items);
	});


	feedparser.on('error', function(error) {
		// always handle errors
		controller.emit('error', error);
	});
	feedparser.on('readable', function() {
		var item;
		while (item = this.read()) {
			items.push(new Item(item.title, item.link));
		}
	});
}

RssSearch.prototype.toString = function() {
	return "RssSearch[url="+this.url+"]";
}


module.exports = RssSearch;