var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	winston = require('winston'),
	fs = require('fs'),
	instances = {};


/**
 * Manager that:
 *    - detect environment
 *    - run the manager with the best available environment
 *    
 * @param sarahContext				the SARAH execution context
 */
function AutoDetectManager(sarahContext) {
	this.sarahContext = sarahContext;
}

util.inherits(AutoDetectManager, EventEmitter);


/**
 * Delegate the run to the previously detected manager for the current action
 */
AutoDetectManager.prototype.run = function() {
	this.delegate("run");
}


/**
 * Delegate the execution of downloadProgress method to the previously detected manager for the current action
 */
AutoDetectManager.prototype.downloadProgress = function() {
	this.delegate("downloadProgress");
}

/**
 * Delegate the run to the previously detected manager for the current action
 */
AutoDetectManager.prototype.delegate = function(/*String*/method) {
	var command = this.sarahContext.data.command;
	// get the best manager for the command
	var Manager = cache[command];
	if(Manager) {
		var instance = instances[command];
		if(!instance) {
			// create a new instance
			instance = instances[command] = new Manager(this.sarahContext);
		}
		// run it
		instance[method]();
	} else {
		winston.log("error", "No manager available to handle the command "+command+". Either autodetect.json doesn't contain any manager for this command or no manager can be used because of your environment");
	}
}








/*==================== static methods ====================*/

var cache = {},
	detectionConf,
	registered = false;


AutoDetectManager.ee = new EventEmitter();

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
AutoDetectManager.initialize = function(initCtx) {
	detectionConf = JSON.parse(fs.readFileSync(initCtx.directory+'/autodetect.json', 'utf8'));
	var command = initCtx.action;
	// register event and store found managers in cache
	if(!registered) {
		registered = true;
		AutoDetectManager.ee.on('managerAvailable', function(command, name, Manager) {
			if(!cache[command]) {
				winston.log("info", "Using manager "+name+" for command "+command);
				cache[command] = Manager;
				Manager.initialize(initCtx);
			}
		});
	}
	// start detection
	AutoDetectManager.next(command, detectionConf[command], 0, initCtx);
}



AutoDetectManager.next = function(/*String*/command, /*String[]*/managers, /*Integer*/managerIdx, /*Object*/detectCtx) {
	var Manager = require('./'+managers[managerIdx]);
	Manager.detect(detectCtx);
	Manager.ee.once('available', function(command, managers, managerIdx, detectCtx, Manager, available) {
		if(available) {
			// if available => stop immediately and trigger managerAvailable event
			AutoDetectManager.ee.emit('managerAvailable', command, managers[managerIdx], Manager);
		} else {
			// not available => try next one
			if(++managerIdx<managers.length) {
				AutoDetectManager.next(command, managers, managerIdx, detectCtx);
			}
		}
	}.bind(this, command, managers, managerIdx, detectCtx, Manager));
}




module.exports = AutoDetectManager;
