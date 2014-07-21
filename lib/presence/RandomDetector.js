var EventEmitter = require('events').EventEmitter,
	util = require('util');

function RandomDetector(min, max) {
	setInterval(this.emit.bind(this, 'presence'), Math.round(Math.random()*max)+min);
}

util.inherits(RandomDetector, EventEmitter);




module.exports = RandomDetector;