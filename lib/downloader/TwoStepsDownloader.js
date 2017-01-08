var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	http = require('http'),
	fs = require('fs');

function TwoStepsDownloader(/*Downloader*/delegate, /*String*/tmpDir) {
	EventEmitter.call(this);
	this.delegate = delegate;
	this.tmpDir = tmpDir+'/';
	delegate.on('downloaded', this.downloaded.bind(this));
}

util.inherits(TwoStepsDownloader, EventEmitter);


TwoStepsDownloader.prototype.start = function(/*Item*/item) {
	this.emit('started', item);
	var torrentPath = this.tmpDir+item.getName()+'.torrent';
	var file = fs.createWriteStream(torrentPath);
	var request = http.get(item.getDownloadUrl(), function(response) {
	  response.pipe(file);
	});
	file.on('finish', function() {
		item.setDownloadFile({
			content: fs.readFileSync(torrentPath),
			name: item.getName()+'.torrent',
			contentType: 'application/x-bittorrent;charset=utf-8'
		});
		this.delegate.start(item);
		fs.unlink(torrentPath);
	}.bind(this));
	request.end();
}


TwoStepsDownloader.prototype.downloaded = function(/*Item*/item) {
	this.emit('downloaded', item);
}

module.exports = TwoStepsDownloader;