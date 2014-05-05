function MockPlayer() {
}

MockPlayer.prototype.play = function(item) {
	// just start playing
	console.log("start playing "+item.getName());
}


module.exports = MockPlayer;