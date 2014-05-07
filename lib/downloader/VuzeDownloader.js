var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	winston = require('winston'),
	exec = require('child_process').exec,
	spawn = require('child_process').spawn,
	xml2js = require('xml2js'),
	parser = new xml2js.Parser();

function VuzeDownloader(sarahContext, matcher) {
	this.sarahContext = sarahContext;
	this.matcher = matcher;
	this.downloading = [];
	EventEmitter.call(this);
}

util.inherits(VuzeDownloader, EventEmitter);

var vuze;

VuzeDownloader.initialize = function(initCtx, vuzePath, javaPath) {
	// start vuze in console mode and wait for commands
	vuzePath = vuzePath || (initCtx.directory+'lib/downloader/vuze/');
	vuze = spawn(javaPath || 'java', ['-classpath', vuzePath, '-jar', vuzePath+'Azureus2.jar', '--ui=console']);
	vuze.stdin.setEncoding('utf8');
	// display vuze output into console
	vuze.stdout.on('data', function (data) {
		console.log(data.toString().trim());
	});
	vuze.stderr.on('data', function (data) {
		console.error(data.toString().trim());
	});
}

VuzeDownloader.prototype.start = function(/*Item*/item) {
	this.downloading.push(item);
	vuze.stdin.write('add '+item.getDownloadUrl()+'\n');
	this.emit('started', item);
	if(!this.interval) {
		this.xml = "";
		this.ee = new EventEmitter();
		vuze.stdout.on('data', this.onXmlData.bind(this));
		this.ee.on('complete', this.onXmlReady.bind(this));
		this.interval = setInterval(this.status.bind(this), 6000);
	}
}

VuzeDownloader.prototype.onXmlData = function(data) {
	this.xml += data.toString().trim();
	if(this.xml.indexOf("</STATS>")!=-1) {
		this.xml = this.xml.replace(/^>\s+\-{5}\s*/g, "");
		this.ee.emit('complete', this.xml);
	}
}

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
							vuze.stdout.removeListener('data', this.onXmlData);
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

VuzeDownloader.prototype.isCompleted = function(download) {
	var status = download.DOWNLOAD_STATUS[0];
	// TODO: is status "Completed" exists ??
	return parseInt(download.COMPLETED[0])==1000 || status=="Seeding" || status=="Completed";
}


VuzeDownloader.prototype.status = function() {
	this.xml = "";
	vuze.stdin.write('xml\n');
}


module.exports = VuzeDownloader;