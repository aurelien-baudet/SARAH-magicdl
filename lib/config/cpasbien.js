var Item = require('../Item'),
	HtmlRegexpUrlProvider = require('../urlProvider/HtmlRegexpUrlProvider');


var baseUrl = "http://www.cpasbien.io";

module.exports = {
	searchSeriesUrl: function() {
		return baseUrl+"/derniers-torrents.php?filtre=series";
	},
	
	searchMoviesUrl: function() {
		return baseUrl+"/derniers-torrents.php?filtre=films";
	},
	
	searchItemSelector: function() {
		return 'div[class^="ligne"] a';
	},
	
	urlProvider: function() {
		return new HtmlRegexpUrlProvider(/href="([^"]+\.torrent)"/, baseUrl);
	},
	
	siteParser: function($, item) {
		return new Item($("a", item).text().replace(/^.+>\s*/, ""), $("a", item).attr("href"));
	}
	
}