var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	ExecutableFinder = require('../util/ExecutableFinder');


/**
 * Detector that checks if VLC is installed
 */
function VlcDetector() {
	EventEmitter.call(this);
}

util.inherits(VlcDetector, EventEmitter);


/**
 * Start detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
VlcDetector.prototype.detect = function(/*Object*/detectCtx) {
	var finder = new ExecutableFinder("vlc", "--version", "C:/Program Files/Vlc/vlc.exe", "C:/Program Files/VideoLAN/VLC/vlc.exe", "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe");
	finder.find();
	finder.once('executable', function(executable) {
		this.emit('available', !!executable);
	}.bind(this));
	return this;
}


module.exports = VlcDetector;