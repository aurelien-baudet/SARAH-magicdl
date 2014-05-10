var request = require("request"),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;


/**
 * Detector that checks if a Freebox is available
 */
function FreeboxDetector() {
	EventEmitter.call(this);
}

util.inherits(FreeboxDetector, EventEmitter);


/**
 * Start detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
FreeboxDetector.prototype.detect = function(/*Object*/detectCtx) {
	request('http://mafreebox.freebox.fr/api_version', function(error, response, body) {
		this.emit('available', !error && response.statusCode==200);
	}.bind(this));
	return this;
}


module.exports = FreeboxDetector;