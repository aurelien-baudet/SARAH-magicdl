var freebox = require("../freebox"),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	fs = require('fs'),
	winston = require('winston');


/**
 * Downloader that drives the Freebox to download files
 * 
 * @param appConf				the Freebox application configuration (needed for authenticating on the Freebox)
 * @param matcher				a matcher that will associate items currently in download with the items to download (there is no simple way 
 * 								to associate items as the name of the file found on a website differs from the name of the file currently downloading)
 * @param directoryConf			optional configuration to tidy up files in folders on Freebox
 */
function FreeboxDownloader(appConf, matcher, directoryConf) {
	this.appConf = appConf;
	this.matcher = matcher;
	this.directoryConf =  directoryConf || [];
	this.downloading = [];
	this.waiting = [];
	EventEmitter.call(this);
}

util.inherits(FreeboxDownloader, EventEmitter);




FreeboxDownloader.ee = new EventEmitter();

/**
 * Check if the Freebox application is registered or not. If not, send registration request to the Freebox
 * 
 * @param initCtx			the initialization context
 * @param file				the path to the file that contains Freebox application information
 * @event done				fired when the initialization of the Freebox is done
 */
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

/**
 * Connect to the Freebox and start the download for the provided item (delegate to download method)
 * 
 * @param item			the item to download
 */
FreeboxDownloader.prototype.start = function(/*Item*/item) {
	if(!this.connected) {
		this.waiting.push(item);
		freebox.connect(this.appConf);
		freebox.on('ready', function() {
			this.connected = true;
			var waiting;
			while(waiting = this.waiting.pop()) {
				this.download(waiting);
			}
		}.bind(this));
	} else {
		this.download(item);
	}
}

/**
 * Tells the Freebox to download the item. Once download is added on the Freebox, the started event is triggered.
 * A timer is set to check the status of the download.
 * 
 * @param item			the item to download
 */
FreeboxDownloader.prototype.download = function(/*Item*/item) {
	this.downloading.push(item);
	var encodedDir = freebox.encodePath(this.getDirectory(item));
	winston.log("debug", "call freebox.addDownloads "+item.getName());
	freebox.addDownloads(item.getDownloadUrl(), encodedDir, false, null, null, null, function(download) {
		this.emit('started', item);
		// use the item to store freebox download information
		item.freebox = {downloadId: download && download.id[0]};		// FIXME: Bug with freebox ??? download is sometimes undefined...
		winston.log("debug", "download added "+item.getName()+" with id="+item.freebox.downloadId);
		if(!this.interval) {
			this.interval = setInterval(this.status.bind(this), 60000);
		}
	}.bind(this));
}

/**
 * Give a directory where to place the downloaded file in the Freebox.
 * Only available if a directoryConf is provided in the constructor.
 * 
 * @param item			the item to download and maybe put in a particular directory
 * @returns the directory for the item
 */
FreeboxDownloader.prototype.getDirectory = function(/*Item*/item) {
	for(var i=0, l=this.directoryConf.length ; i<l ; i++) {
		var dirConf = this.directoryConf[i];
		if(new RegExp(dirConf.regexp, "gi").test(item.getName())) {
			winston.log("debug", "directory "+dirConf.directory+" found for "+item.getName());
			return dirConf.directory;
		}
	}
}

/**
 * Get the Freebox download that corresponds to the internal item.
 * 
 * @param item			the internal item
 * @param downloads		a list of all Freebox downloads
 * @returns the found Freebox download that matches the item or null if not found
 */
FreeboxDownloader.prototype.getAssociatedDownload = function(item, downloads) {
	for(var i=0, l=downloads.length ; i<l ; i++) {
		var fbdl = downloads[i];
		// FIXME: wait for response of freebox developers for getting the right download id
		if(item.freebox.downloadId==fbdl.id) {
			return fbdl;
		}
	}
	return this.matcher.match(item, downloads);
}

/**
 * Method regularly triggered for checking download status. If a download is completed then the event downloaded is triggered.
 */
FreeboxDownloader.prototype.status = function() {
	freebox.downloads(null, null, null, function(downloads){
		if(downloads=='No download') {
			downloads = [];
		}
		winston.log("debug", "=============== checking status ================");
		for(var i=0 ; i<this.downloading.length ; i++) {
			var item = this.downloading[i];
			var fbdl = this.getAssociatedDownload(item, downloads);
			if(fbdl && (fbdl.status=="done" || fbdl.status=="seeding")) {
				this.downloading.splice(this.downloading.indexOf(item), 1);
				i--;
				// share file in order to be able to play it
				freebox.share.create(freebox.encodePath((this.getDirectory(item) || '/Disque dur/Téléchargements/')+'/'+fbdl.name), function(share) {
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