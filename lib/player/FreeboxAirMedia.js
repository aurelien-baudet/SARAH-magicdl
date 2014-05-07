var	freebox = require("../freebox"),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

/**
 * Player that uses the Freebox AirMedia feature to play the downloaded items.
 * 
 * @param appConf			mandatory Freebox application information for being able to drive it
 */
function FreeboxAirMedia(/*Object*/appConf) {
	this.appConf = appConf;
}

FreeboxAirMedia.ee = new EventEmitter();

/**
 * Check if the Freebox application is registered or not. If not, send registration request to the Freebox.
 * Once done, update Freebox configuration to allow external access to downloaded files
 * 
 * @param initCtx			the initialization context
 * @param file				the path to the file that contains Freebox application information
 * @event done				fired when the initialization of the Freebox is done
 */
FreeboxAirMedia.initialize = function(/*Object*/initCtx, /*String*/file) {
	// check if the file that contains application information exists
	fs.exists(file, function(exists) {
		// if doesn't exists => ask to accept the application and then configure the Freebox
		// if exists => directly configure the Freebox
		if(!exists) {
			initCtx.SARAH.speak("Vous devez accepter l'application sur votre Freebox. Sélectionnez Oui sur l'écran LCD de la Freebox");
			winston.info("");
			winston.info("Vous devez accepter l'application sur votre Freebox Server. Sélectionnez Oui sur l'écran LCD de la Freebox");
			winston.info("");
			freebox.connect();
			freebox.on('ready', function() {
				// register the application and wait for user acceptance
				freebox.register();
				freebox.on('registered', function(appInfo) {
					// configure for allowing external access
					freebox.connection.config.update({
						api_remote_access : true
					}, function() {
						FreeboxAirMedia.ee.emit('done', appInfo);
					});
				}.bind(this));
			}.bind(this));
		} else {
			var appInfo = JSON.parse(fs.readFileSync(file));
			freebox.connect(appInfo);
			freebox.on('ready', function() {
				// configure for allowing external access
				freebox.connection.config.update({
					api_remote_access : true
				}, function() {
					FreeboxAirMedia.ee.emit('done');
				});
			}.bind(this));
		}
	});
}

/**
 * Start playing the item with the Freebox AirMedia feature. Simply provide the item.getPlayUrl()
 * information to start it.
 * 
 * @param item				the item to play
 */
// TODO: should get list of receivers and select which has video capability
FreeboxAirMedia.prototype.play = function(/*Item*/item) {
	if(!this.connected) {
		this.waiting.push(item);
		freebox.connect(this.appConf);
		freebox.on('ready', function() {
			this.connected = true;
			var waiting;
			while(waiting = this.waiting.pop()) {
				freebox.airmedia.receivers.play(waiting.getPlayUrl(), function() {});
			}
		}.bind(this));
	} else {
		freebox.airmedia.receivers.play(item.getPlayUrl(), function() {});
	}
}


module.exports = FreeboxAirMedia;