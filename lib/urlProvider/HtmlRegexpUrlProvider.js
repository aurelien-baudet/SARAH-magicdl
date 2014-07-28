var http = require('http'),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	winston = require('winston');


/**
 * Url provider that parses an HTML page with a regular expression
 * 
 * @param regexp		the regular expression used to find the url
 * @param prefix		an optional prefix to place before the found url
 */
function HtmlRegexpUrlProvider(/*String|RegExp*/regexp, /*String*/prefix) {
	this.re = regexp;
	this.prefix = prefix || "";
	EventEmitter.call(this);
}

util.inherits(HtmlRegexpUrlProvider, EventEmitter);

/**
 * Set the download url for the item. Parses the HTML page and use a regular expression to find the download url.
 * 
 * @param item			the item that needs a download url
 */
HtmlRegexpUrlProvider.prototype.setDownloadUrl = function(/*Item*/item) {
	// TODO: manage errors
	var req = http.get(item.getDownloadUrl(), function(res) {
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
			} else {
				winston.log("error", "can't find url for item "+item.getName());
			}
		}.bind(this));
	}.bind(this));
	req.end();
}




module.exports = HtmlRegexpUrlProvider;