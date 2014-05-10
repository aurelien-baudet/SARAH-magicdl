var	util = require('util'),
	ExecutableFinder = require('../util/ExecutableFinder');


/**
 * Player that uses VLC to play videos.
 * 
 * @param sarahContext			the SARAH context
 * @param vlcPath				optional path where to find VLC executable
 */
function Vlc(/*Object*/sarahContext, /*String?*/vlcPath) {
	this.sarahContext = sarahContext;
	this.vlcPath = vlcPath;
}


/**
 * Start playing the item with VLC. Simply provide the item.getPlayUrl()
 * information to start it.
 * 
 * @param item				the item to play
 */
Vlc.prototype.play = function(/*Item*/item) {
	console.log("launch vlc "+item.getSpeakName()+": "+item.getPlayUrl());
	var finder = new ExecutableFinder("vlc", "--version", this.vlcPath, "C:/Program Files/Vlc/vlc.exe", "C:/Program Files/VideoLAN/VLC/vlc.exe", "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe");
	finder.find();
	finder.once('executable', function(executable) {
		this.sarahContext.SARAH.runApp(executable, '"'+item.getPlayUrl()+'"');
	}.bind(this));
}


module.exports = Vlc;