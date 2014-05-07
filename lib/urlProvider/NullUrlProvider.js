var EventEmitter = require('events').EventEmitter,
	util = require('util');

/**
 * Url provider that does nothing
 */
function NullUrlProvider() {
	EventEmitter.call(this);
}

util.inherits(NullUrlProvider, EventEmitter);


/**
 * Set the download url for the item
 * 
 * @param item			the item that needs a download url
 */
NullUrlProvider.prototype.setDownloadUrl = function(/*Item*/item) {
	item.setDownloadUrl(item.getDownloadUrl());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = NullUrlProvider;