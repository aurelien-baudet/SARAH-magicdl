var freebox = require("../freebox"),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	fs = require('fs'),
	winston = require('winston');

function FreeboxDownloader(appConf, matcher, directoryConf) {
	this.appConf = appConf;
	this.matcher = matcher;
	this.directoryConf =  directoryConf || [];
	this.downloading = [];
	EventEmitter.call(this);
}

util.inherits(FreeboxDownloader, EventEmitter);


FreeboxDownloader.ee = new EventEmitter();

FreeboxDownloader.initialize = function(initCtx, file) {
	fs.exists(file, function(exists) {
		if(!exists) {
			initCtx.SARAH.speak("Vous devez accepter l'application sur votre Freebox. Sélectionnez Oui sur l'écran LCD de la Freebox");
			winston.info("");
			winston.info("Vous devez accepter l'application sur votre Freebox Server. Sélectionnez Oui sur l'écran LCD de la Freebox");
			winston.info("");
			freebox.connect();
			freebox.on('ready', function() {
				freebox.register();
				freebox.on('registered', function(appInfo) {
					fs.writeFileSync(file, JSON.stringify(appInfo));
					FreeboxDownloader.ee.emit('done', appInfo);
				});
			});
		} else {
			setTimeout(FreeboxDownloader.ee.emit.bind(FreeboxDownloader, 'done'), 0);
		}
	});
}


FreeboxDownloader.prototype.start = function(item) {
	if(!this.connected) {
		this.connecting = true;
		freebox.connect(this.appConf);
		freebox.on('ready', function() {
			this.connected = true;
			if(this.connecting) {
				this.connecting = false;
				this.download(item);
			}
		}.bind(this));
	} else {
		this.download(item);
	}
}

FreeboxDownloader.prototype.download = function(item) {
	this.downloading.push(item);
	var encodedDir = freebox.encodePath(this.getDirectory(item));
	freebox.addDownloads(item.getDownloadUrl(), encodedDir, false, null, null, null, function(download) {
		this.emit('started', item);
		// use the item to store freebox download information
		item.freebox = {downloadId: download.id[0]};
		winston.log("debug", "download added "+item.getName()+" with id="+item.freebox.downloadId);
		if(!this.interval) {
			this.interval = setInterval(this.status.bind(this), 60000);
		}
	}.bind(this));
}

FreeboxDownloader.prototype.getDirectory = function(item) {
	for(var i=0, l=this.directoryConf.length ; i<l ; i++) {
		var dirConf = this.directoryConf[i];
		if(new RegExp(dirConf.regexp, "gi").test(item.getName())) {
			winston.log("debug", "directory "+dirConf.directory+" found for "+item.getName());
			return dirConf.directory;
		}
	}
}

FreeboxDownloader.prototype.getAssociatedDownload = function(item, downloads) {
	for(var i=0, l=downloads.length ; i<l ; i++) {
		var fbdl = downloads[i];
		// FIXME: wait for response of freebox developers for getting the right download id
		if(item.freebox.downloadId==fbdl.id) {
			return fbdl;
		}
	}
	return this.matcher.match(item, downloads);
		// if ids differ => check using the name
		// FIXME: if two downloading items match the same regular expression => wrong item
		// FIXME: how to do if no directoryConf provided (case on search without regexp filter ?)
//		for(var i=0, l=this.directoryConf.length ; i<l ; i++) {
//			var dirConf = this.directoryConf[i];
//			var regexp = dirConf.regexp.replace(/ /g, ".");
//			// Bug with regular expressions when g flag is set => need to create new RegExp object for each call to test
//			if(new RegExp(regexp, "gi").test(item.getName()) && new RegExp(regexp, "gi").test(fbdl.name) && fbdl.id>item.freebox.downloadId) {
//				winston.log("debug", "---> FOUND fbdl: "+fbdl.name+", "+fbdl.id+"  <->  "+item.freebox.downloadId);
//				return true;
//			}
//		}
}

FreeboxDownloader.prototype.status = function() {
	freebox.downloads(null, null, null, function(downloads){
		if(downloads=='No download') {
			downloads = [];
		}
		winston.log("debug", "=============== checking status ================");
		for(var i=0 ; i<this.downloading.length ; i++) {
			var item = this.downloading[i];
			var fbdl = this.getAssociatedDownload(item, downloads);
			if(item && (d.status=="done" || d.status=="seeding")) {
				this.downloading.splice(this.downloading.indexOf(item), 1);
				i--;
				// share file in order to be able to play it
				freebox.share.create(freebox.encodePath((this.getDirectory(item) || '/Disque dur/Téléchargements/')+'/'+d.name), function(share) {
					// update the play url
					item.setPlayUrl(share.fullurl);
					this.emit('downloaded', item);
				}.bind(this));
				if(this.downloading.length==0 || downloads.length==0) {
					clearInterval(this.interval);
					this.interval = null;
				}
			}
		}
	}.bind(this));
}


module.exports = FreeboxDownloader;