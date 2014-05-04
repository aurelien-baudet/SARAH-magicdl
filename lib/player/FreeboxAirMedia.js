var	freebox = require("../freebox"),
	util = require('util');

function FreeboxAirMedia(appConf) {
	this.appConf = appConf;
}

FreeboxAirMedia.ee = new EventEmitter();

FreeboxAirMedia.initialize = function(initCtx, appInfo) {
	// TODO: configure for allowing external access
	freebox.connect(appInfo);
	freebox.on('ready', function() {
		freebox.connection.config.update({
			api_remote_access : true
		}, function() {
			FreeboxAirMedia.ee.emit('done');
		});
	}.bind(this));
}

// TODO: should get list of receivers and select which has video capability
FreeboxAirMedia.prototype.play = function(item) {
	if(!this.connected) {
		this.connecting = true;
		freebox.connect(this.appConf);
		freebox.on('ready', function() {
			this.connected = true;
			if(this.connecting) {
				this.connecting = false;
				freebox.airmedia.receivers.play(item.getPlayUrl(), function() {});
			}
		}.bind(this));
	} else {
		freebox.airmedia.receivers.play(item.getPlayUrl(), function() {});
	}
}


module.exports = FreeboxAirMedia;