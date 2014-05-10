var util = require('util'),
	EventEmitter = require('events').EventEmitter;


/**
 * Logical AND detector. Takes a list of detectors and run them one by one to check if they all
 * are available. If one not available then it immediately triggers available event with false
 * 
 * @param detectors			either a list of detectors or multiple detector arguments
 */
function AndDetector(/*Detector[]|Detector...*/detectors) {
	detectors = this.detectors = util.isArray(detectors) ? detectors : Array.prototype.slice.call(arguments);
	for(var i=0, l=detectors.length ; i<l ; i++) {
		detectors[i].on('available', this.available.bind(this));
	}
	EventEmitter.call(this);
}

util.inherits(AndDetector, EventEmitter);


/**
 * Start detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
AndDetector.prototype.detect = function(/*Object*/detectCtx) {
	this.detectorIdx = 0;
	this.detectCtx = detectCtx;
	this.next();
	return this;
}

AndDetector.prototype.next = function() {
	// if there still have sub detectors to apply => start it
	// else (all sub detectors have been executed) <-> no sub detector has set available to false => set available to true
	if(this.detectorIdx<this.detectors.length) {
		// apply next detector
		this.detectors[this.detectorIdx].detect(this.detectorCtx);
	} else {
		// set available to true
		this.emit('available', true);
	}
}

AndDetector.prototype.available = function(/*Boolean*/available) {
	// item is available by previous sub detector => try next sub detector
	this.detectorIdx++;
	this.next();
}



module.exports = AndDetector;