var EventEmitter = require('events').EventEmitter,
	util = require('util');

function MockDownloader() {
	EventEmitter.call(this);
}

util.inherits(MockDownloader, EventEmitter);


MockDownloader.prototype.start = function(/*Item*/item) {
	this.emit('started', item);
	item.setPlayUrl("http://foo.bar/movie.avi");
	setTimeout(this.emit.bind(this, 'downloaded', item), 20000);
}


module.exports = MockDownloader;