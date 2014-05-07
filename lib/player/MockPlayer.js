function MockPlayer() {
}

MockPlayer.prototype.play = function(/*Item*/item) {
	// just start playing
	console.log("start playing "+item.getName());
}


module.exports = MockPlayer;