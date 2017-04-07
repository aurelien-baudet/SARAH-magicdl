var Item = require('../Item'),
	HtmlRegexpUrlProvider = require('../urlProvider/HtmlRegexpUrlProvider');


var baseUrl = "https://www.nextorrent.net";

module.exports = {
	searchSeriesUrl: function() {
		return baseUrl+"/torrents/cat/séries-vostfr";
	},
	
	searchMoviesUrl: function() {
		return baseUrl+"/torrents/cat/films";
	},
	
	searchItemSelector: function() {
		return 'td a';
	},
	
	urlProvider: function() {
		return new HtmlRegexpUrlProvider(/href='([^']*dl-torrent\/[^']+)'/, baseUrl);
	},
	
	siteParser: function($, item) {
		return new Item($('td a', item).text().replace(/^\s*/, ""), baseUrl+$('a', item).attr("href"));
	}
	
}