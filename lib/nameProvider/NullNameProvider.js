var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
function NullNameProvider() {
	EventEmitter.call(this);
}

util.inherits(NullNameProvider, EventEmitter);


NullNameProvider.prototype.setSpeakName = function(item) {
	item.setSpeakName(item.getName());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}



module.exports = NullNameProvider;