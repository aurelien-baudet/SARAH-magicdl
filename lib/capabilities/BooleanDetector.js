var util = require('util'),
	EventEmitter = require('events').EventEmitter;


/**
 * Detector that always give provided result
 * 
 * @param result			the result that will be given when triggering 'available' event
 */
function BooleanDetector(/*Boolean*/result) {
	this.result = result;
	EventEmitter.call(this);
}

util.inherits(BooleanDetector, EventEmitter);


/**
 * Start detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
BooleanDetector.prototype.detect = function(/*Object*/detectCtx) {
	setTimeout(this.emit.bind(this, 'available', this.result), 0);
	return this;
}


module.exports = BooleanDetector;