var freebox = require("../freebox"),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	fs = require('fs'),
	winston = require('winston'),
	Progress = require('../Progress');


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
			freebox.once('ready', function() {
				freebox.register();
				freebox.once('registered', function(appInfo) {
					var interval = setInterval(freebox.isAccepted, 500);
					freebox.once('status:granted', function(app) {
						clearInterval(interval);
						fs.writeFileSync(file, JSON.stringify(appInfo));
						FreeboxDownloader.ee.emit('done', appInfo);
					});
				}.bind(this));
			});
		} else {
			setTimeout(FreeboxDownloader.ee.emit.bind(FreeboxDownloader.ee, 'done', JSON.parse(fs.readFileSync(file))), 0);
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
	if(item.getDownloadFile()) {
		winston.log("debug", "call freebox.addFileDownload "+item.getName());
		freebox.addFileDownload(item.getDownloadFile(), encodedDir, null, this.fbDownloadStarted.bind(this, item));
	} else {
		winston.log("debug", "call freebox.addDownloads "+item.getName());
		freebox.addDownloads(item.getDownloadUrl(), encodedDir, false, null, null, null, this.fbDownloadStarted.bind(this, item));
	}
}

FreeboxDownloader.prototype.fbDownloadStarted = function(/*Item*/item, /*Object*/download) {
	this.emit('started', item);
	// use the item to store freebox download information
	var downloadId = download && (typeof download.id=="number" ? download.id : download.id[0]);		// FIXME: Bug with freebox ??? download is sometimes undefined...
	item.freebox = {downloadId: downloadId};
	winston.log("debug", "download added "+item.getName()+" with id="+downloadId);
	if(!this.interval) {
		this.interval = setInterval(this.status.bind(this), 60000);
	}
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
		if(item.freebox.downloadId==fbdl.id && !/\.torrent$/.test(fbdl.name)) {
			return fbdl;
		}
	}
	// TODO: exclude .torrent from best matcher
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
				if(this.downloading.length==0 || downloads.length==0) {
					clearInterval(this.interval);
					this.interval = null;
				}
				// get the path to the real video file (in case the video is in folder)
				console.log("getVideoFile", item, fbdl);
				this.getVideoFile(fbdl.id, function(item, path) {
					console.log("getVideoFile:callback", item, fbdl, path);

					// share file in order to be able to play it
					freebox.share.create(path, function(item, share) {
						console.log("share:callback", item, fbdl, share);

						// update the play url
						item.setPlayUrl(share.fullurl);
						this.emit('downloaded', item);
					}.bind(this, item));
				}.bind(this, item));
			}
		}
	}.bind(this));
}

/**
 * Get the video file for the download task. If there is only one file then return this file.
 * If there are several files, find the file that has either a video mimetype or a video file extension.
 * If there are several video files, then if the file contains "sample", skip it and use another video file.
 * 
 * @param task the download task
 * @param callback the function to execute when the file is found
 * @returns the path to the video file (encoded)
 */
FreeboxDownloader.prototype.getVideoFile = function(/*String*/task, /*Function*/callback) {
	freebox.getDownloadFiles(task, function(files) {
					console.log("getDownloadFiles:cb", task, files);

		var file = files.length==1 ? files[0] : this.findBestFile(files);
					console.log("getDownloadFiles:file", file);
		if(file) {
			var pathEncoded = file.filepath;
			var path = new Buffer(pathEncoded, 'base64').toString('utf8');
			var fixedPath = path.replace(/\/+/g, "/");
			callback(freebox.encodePath(fixedPath));
		} else {
			winston.log("error", "no video file found in folder "+file.filepath);
		}
	}.bind(this));
}


/**
 * Get the video file. If there are several files, find the file that has either a video mimetype or a video file extension.
 * If there are several video files, then if the file contains "sample", skip it and use another video file.
 * 
 * @param files the list of files
 * @returns the path to the video file
 */
//TODO: externalize this algorithm in case we want to reuse the downloader for other kind of file
FreeboxDownloader.prototype.findBestFile = function(files) {
	var bestFile = null;
	for(var i=0, l=files.length ; i<l ; i++) {
		var file = files[i];
		console.log("findBestFile", file);
		if(/*file.type=="file" && */(/video/i.test(file.mimetype) || /.+\.(avi|mkv|mov|mpg|3gp|asf|avchd|flv|m4v|mpeg|mpe|ogg|wmv)$/i.test(file.name))) {
			console.log("video file", file);
			if(bestFile==null || (/sample/i.test(bestFile) && !/sample/i.test(file))) {
				console.log("sample", file);
				bestFile = file;
			}
		}
	}
	console.log("best file", file);
	return bestFile;
}

/**
 * Method used to get current download progress
 */
FreeboxDownloader.prototype.progress = function() {
	freebox.downloads(null, null, null, function(downloads){
		if(downloads=='No download') {
			downloads = [];
		}
		var progressList = [];
		winston.log("debug", "=============== current progress ================");
		for(var i=0 ; i<this.downloading.length ; i++) {
			var item = this.downloading[i];
			var fbdl = this.getAssociatedDownload(item, downloads);
			if(fbdl) {
				progressList.push(new Progress(item, Math.round(fbdl.rx_pct/100), fbdl.eta*1000));
			}
		}
		this.emit('progress', progressList);
	}.bind(this));
}


module.exports = FreeboxDownloader;