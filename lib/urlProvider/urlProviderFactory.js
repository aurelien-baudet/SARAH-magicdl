var HtmlRegexpUrlProvider = require('./HtmlRegexpUrlProvider');

module.exports = {
	cpasbien: function() {
		return new HtmlRegexpUrlProvider(/href="([^"]+\.torrent)"/, "http://www.cpasbien.pe");
	}
}