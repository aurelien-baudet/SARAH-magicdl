var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	winston = require('winston'),
	exec = require('child_process').exec,
	spawn = require('child_process').spawn,
	xml2js = require('xml2js'),
	parser = new xml2js.Parser(),
	ExecutableFinder = require('../util/ExecutableFinder'),
	Progress = require('../Progress');



/**
 * Downloader that drives Vuze to download files
 * 
 * @param matcher				a matcher that will associate items currently in download with the items to download (there is no simple way 
 * 								to associate items as the name of the file found on a website differs from the name of the file currently downloading)
 */
function VuzeDownloader(/*Matcher[]|Matcher...*/matcher) {
	this.matcher = matcher;
	this.downloading = [];
	EventEmitter.call(this);
}

util.inherits(VuzeDownloader, EventEmitter);


/**
 * Find where java is installed
 * 
 * @param initCtx			the initialization context
 * @param vuzePath			optional path where Vuze is available. By default, uses the embedded version
 * @event javaPath			optional path where Java is installed. By default, find it using regular installation paths
 */
VuzeDownloader.initialize = function(/*Object*/initCtx, /*String?*/vuzePath, /*String?*/javaPath) {
	VuzeDownloader.vuzePath = vuzePath || (initCtx.directory+'lib/downloader/vuze/');
	var finder = new ExecutableFinder("java", "-version", "C:/Program Files/Java/*/bin/java.exe");
	finder.find();
	finder.once('executable', function(executable) {
		VuzeDownloader.executable = javaPath || executable;
	});
}


/**
 * Start Vuze
 */
VuzeDownloader.startVuze = function() {
	// start vuze in console mode and wait for commands
	var vuze = VuzeDownloader.vuze = spawn(VuzeDownloader.executable, ['-classpath', VuzeDownloader.vuzePath, '-jar', VuzeDownloader.vuzePath+'Azureus2.jar', '--ui=console']);
	vuze.stdin.setEncoding('utf8');
	// display vuze output into console
	vuze.stdout.on('data', function (data) {
		console.log(data.toString().trim());
	});
	vuze.stderr.on('data', function (data) {
		console.error(data.toString().trim());
	});
}


/**
 * Start the download of the item using Vuze
 * 
 * @param item			the item to download
 */
VuzeDownloader.prototype.start = function(/*Item*/item) {
	this.downloading.push(item);
	// FIXME: spawn fails when used in 'executable' event callback... Why ???
	if(!VuzeDownloader.vuze) {
		VuzeDownloader.startVuze();
	}
	VuzeDownloader.vuze.stdin.write('add '+item.getDownloadUrl()+'\n');
	this.emit('started', item);
	if(!this.interval) {
		this.xml = "";
		this.ee = new EventEmitter();
		VuzeDownloader.vuze.stdout.on('data', this.onXmlData.bind(this));
		this.ee.on('complete', this.onXmlReady.bind(this));
		this.interval = setInterval(this.status.bind(this), 60000);
	}
}


/**
 * Fired when Vuze writes into stdout. Read it to get the content of the written xml.
 * Once xml is complete, trigger 'complete' event.
 * 
 * @param data			the data written in stdout
 */
VuzeDownloader.prototype.onXmlData = function(/*String*/data) {
	this.xml += data.toString().trim();
	if(this.xml.indexOf("</STATS>")!=-1) {
		this.xml = this.xml.replace(/^>\s+\-{5}\s*/g, "");
		this.ee.emit('complete', this.xml);
	}
}


/**
 * Fired when xml is completely read from stdout. Check the status of the downloads to know if the item
 * is downloaded.
 * 
 * @param xml			the xml string
 */
VuzeDownloader.prototype.onXmlReady = function(xml) {
	parser.parseString(xml, function(err, result) {
		if(result) {
			var downloads = result.STATS.DOWNLOADS[0].DOWNLOAD;
			for(var i=0 ; i<this.downloading.length ; i++) {
				var item = this.downloading[i];
				var download = this.matcher.match(item, downloads);
				if(download) {
					var completed = parseInt(download.COMPLETED[0])==1000;
					if(completed) {
						this.downloading.splice(this.downloading.indexOf(item), 1);
						i--;
						// TODO: share this file to be accessible through the net (for freebox access for example)
						// TODO: Window share + private LAN url or share online ?
						item.setPlayUrl("file:///"+encodeURIComponent(download.TARGET_FILE[0].replace(/\\+/g, "/")));
						this.emit('downloaded', item);
						if(this.downloading.length==0 || downloads.length==0) {
							clearInterval(this.interval);
							this.interval = null;
							VuzeDownloader.vuze.stdout.removeListener('data', this.onXmlData);
							this.ee.removeListener('complete', this.onXmlReady);
						}
					}
				}
			}
		} else {
			console.error(err);
		}
	}.bind(this));
}


/**
 * Checks if the provided Vuze download is completed
 * 
 * @param download			the Vuze download
 */
VuzeDownloader.prototype.isCompleted = function(download) {
	var status = download.DOWNLOAD_STATUS[0];
	// TODO: is status "Completed" exists ??
	return parseInt(download.COMPLETED[0])==1000 || status=="Seeding" || status=="Completed";
}


/**
 * Fired regularly to check download status. Send 'xml' command to Vuze and then read the xml response.
 */
VuzeDownloader.prototype.status = function() {
	this.xml = "";
	VuzeDownloader.vuze.stdin.write('xml\n');
}


/**
 * Method used to get current download progress
 */
VuzeDownloader.prototype.progress = function() {
	this.status();
	this.ee.once('complete', function(xml) {
		parser.parseString(xml, function(err, result) {
			if(result) {
				var progressList = [];
				var downloads = result.STATS.DOWNLOADS[0].DOWNLOAD;
				for(var i=0 ; i<this.downloading.length ; i++) {
					var item = this.downloading[i];
					var download = this.matcher.match(item, downloads);
					if(download) {
						var size = parseInt(download.TORRENT[0].SIZE[0].RAW[0]);
						var downloadedSize = parseInt(download.DOWNLOADED[0].RAW[0]);
						var downloadSpeed = parseInt(download.DOWNLOAD_SPEED[0].RAW[0]);
						progressList.push(new Progress(item, Math.round(downloadedSize/size*100), Math.ceil((size-downloadedSize)/downloadSpeed*1000)));
					}
				}
				this.emit('progress', progressList);
			} else {
				console.error(err);
			}
		}.bind(this));
	}.bind(this));
}


module.exports = VuzeDownloader;