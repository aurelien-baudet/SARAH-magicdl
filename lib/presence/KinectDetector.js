var EventEmitter = require('events').EventEmitter,
	winston = require('winston'),
	util = require('util');

function KinectDetector(sarahContext) {
	// TODO: do not overwrite existing standby if any
	winston.log("info", "register standby");
	sarahContext.plugin.standBy = this.motion.bind(this);
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
	winston.log("info", "motion "+motion);
	this.emit(motion ? 'presence' : 'absence');
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