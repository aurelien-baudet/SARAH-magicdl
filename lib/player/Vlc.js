var	util = require('util');

function Vlc(sarahContext, vlcPath) {
	this.sarahContext = sarahContext;
	this.vlcPath = vlcPath || "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe";
}

Vlc.prototype.play = function(/*Item*/item) {
	console.log("launch vlc "+item.getSpeakName()+": "+item.getPlayUrl());
	this.sarahContext.SARAH.runApp(this.vlcPath, '"'+item.getPlayUrl()+'"');
}


module.exports = Vlc;