var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	ExecutableFinder = require('../util/ExecutableFinder');


/**
 * Detector that checks if Java is installed
 */
function JavaDetector() {
	EventEmitter.call(this);
}

util.inherits(JavaDetector, EventEmitter);


/**
 * Start detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
JavaDetector.prototype.detect = function(/*Object*/detectCtx) {
	var finder = new ExecutableFinder("java", "-version", "C:/Program Files/Java/*/bin/java.exe");
	finder.find();
	finder.once('executable', function(executable) {
		this.emit('available', !!executable);
	}.bind(this));
	return this;
}


module.exports = JavaDetector;