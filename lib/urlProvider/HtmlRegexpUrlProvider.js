var http = require('http'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');


function HtmlRegexpUrlProvider(regexp, prefix) {
	this.re = regexp;
	this.prefix = prefix || "";
	EventEmitter.call(this);
}

util.inherits(HtmlRegexpUrlProvider, EventEmitter);

HtmlRegexpUrlProvider.prototype.setDownloadUrl = function(item) {
	// TODO: manage errors
	var req = http.get(item.getUrl(), function(res) {
		var html = "";
		res.on("data", function(chunk) {
			html += chunk;
		});
		res.on('end', function() {
			var dlurl;
			html.replace(this.re, function(_, url) {
				dlurl = this.prefix+url;
			}.bind(this));
			if(dlurl) {
				item.setDownloadUrl(dlurl);
				this.emit('done', item);
			}
		}.bind(this));
	}.bind(this));
	req.end();
}




module.exports = HtmlRegexpUrlProvider;