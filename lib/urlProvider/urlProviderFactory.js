var HtmlRegexpUrlProvider = require('./HtmlRegexpUrlProvider');

module.exports = {
	cpasbien: function() {
		return new HtmlRegexpUrlProvider(/href="(.*\/download-torrent\/[^"]+\.torrent)"/, "http://www.cpasbien.pe");
	}
}