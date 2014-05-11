var util = require('util'),
	EventEmitter = require('events').EventEmitter;


/**
 * Detector that checks if a particular environment value is set
 * 
 * @param name			the name of the environment variable
 * @param value			optional the expected value. If not set, then only checks if the variable exists
 */
function EnvironmentVariableDetector(/*String*/name, /*String?|RegExp?*/value) {
	this.name = name;
	this.value = value;
	EventEmitter.call(this);
}

util.inherits(EnvironmentVariableDetector, EventEmitter);


/**
 * Start detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
EnvironmentVariableDetector.prototype.detect = function(/*Object*/detectCtx) {
	var value = process.env[this.name];
	var matches;
	if(this.value) {
		matches = this.value instanceof RegExp ? new RegExp(this.value).test(value) : this.value==value;
	} else {
		matches = !!value;
	}
	setTimeout(this.emit.bind(this, 'available', matches), 0);
	return this;
}


module.exports = EnvironmentVariableDetector;