var Item = require('../Item'),
	HtmlRegexpUrlProvider = require('../urlProvider/HtmlRegexpUrlProvider');


var baseUrl = "http://www.torrent9.biz";

module.exports = {
	searchSeriesUrl: function() {
		return baseUrl+"/torrents_series.html";
	},
	
	searchMoviesUrl: function() {
		return baseUrl+"/torrents_films.html";
	},
	
	searchItemSelector: function() {
		return 'td > a';
	},
	
	urlProvider: function() {
		return new HtmlRegexpUrlProvider(/href="([^"]+get_torrent[^"]+)"/, baseUrl);
	},
	
	siteParser: function($, item) {
		return new Item($('td > a', item).text().replace(/^\s*/, ""), baseUrl+$('a', item).attr("href"));
	}
	
}