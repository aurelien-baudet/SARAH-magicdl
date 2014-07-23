var EventEmitter = require('events').EventEmitter,
	winston = require('winston'),
	util = require('util');

function KinectDetector(/*Object*/sarahContext, /*Integer?*/minChangeTime) {
	winston.log("info", "register standby");
	this.minChangeTime = minChangeTime || 2*60*60*1000;
	this.lastChangeDate = null;
	sarahContext.plugin.registerStandBy(this.motion.bind(this));
}

util.inherits(KinectDetector, EventEmitter);

/**
 * Trigger the events
 * 
 * @param motion true if there was a motion, false otherwise
 * @event presence if presence has been detected
 * @event absence if absence has been detected
 */
KinectDetector.prototype.motion = function(motion) {
	winston.log("debug", "motion "+motion);
	if(!this.lastChangeDate || ! this.minChangeTime || new Date().getTime()-this.lastChangeDate>this.minChangeTime) {
		winston.log("info", "trigger motion "+motion);
		this.emit(motion ? 'presence' : 'absence');
	}
	this.lastChangeDate = new Date().getTime();
}

//KinectDetector.ee = new EventEmitter();
//
///**
// * Register this into the standby hook
// * 
// * @param initCtx			the initialization context
// * @event done				fired when the initialization of the Freebox is done
// */
//KinectDetector.initialize = function(/*Object*/initCtx, /*String*/file) {
//	// TODO: do not overwrite existing standby if any
//	initCtx.plugin.standBy = function(motion, data, SARAH) {
//	}
//	KinectDetector.ee.emit('done');
//}

module.exports = KinectDetector;