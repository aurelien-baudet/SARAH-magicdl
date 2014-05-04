var EventEmitter = require('events').EventEmitter,
	util = require('util');


function NullUrlProvider() {
	EventEmitter.call(this);
}

util.inherits(NullUrlProvider, EventEmitter);

NullUrlProvider.prototype.setDownloadUrl = function(item) {
	item.setDownloadUrl(item.getUrl());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = NullUrlProvider;