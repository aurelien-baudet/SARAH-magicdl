var exec = require('child_process').exec,
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	glob = require("glob");


/**
 * Utility that check if an executable is installed
 * 
 * @param name			the name of the executable
 * @param args			arguments used to test if the executable can be run
 * @param paths			a list of paths where to probably find the executable
 */
function ExecutableFinder(/*String*/name, /*String*/args, /*String[]|String...*/paths) {
	this.name = name;
	this.command = name+(args ? ' '+args : '');
	this.paths = util.isArray(paths) ? paths : Array.prototype.slice.call(arguments, 2);
	EventEmitter.call(this);
}

util.inherits(ExecutableFinder, EventEmitter);


/**
 * Find the path to the executable
 * 
 * @returns this for chaining
 */
ExecutableFinder.prototype.find = function() {
	// try to run the program
	this.child = exec(this.command, function callback(error, stdout, stderr) {
		// stop the process
		if(this.child) {
			this.child.kill();
		}
		// failed to execute the program => check if any path exists
	    if(error) {
	    	var found = null;
	    	for(var i=0, l=this.paths.length ; i<l ; i++) {
	    		var path = this.paths[i];
	    		if(path) {
	    			var files = glob.sync(path);
	    			if(files.length) {
	    				found = files[0];
	    				break;
	    			}
	    		}
	    	}
	    	this.emit('executable', found);
	    } else {
	    	this.emit('executable', this.name);
	    }
	}.bind(this));
	return this;
}

module.exports = ExecutableFinder;