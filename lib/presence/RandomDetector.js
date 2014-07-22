var EventEmitter = require('events').EventEmitter,
	util = require('util');

function RandomDetector(min, max) {
	setInterval(this.emit.bind(this, 'presence'), Math.round(Math.random()*(max || 100000))+(min || 0));
}

util.inherits(RandomDetector, EventEmitter);




module.exports = RandomDetector;