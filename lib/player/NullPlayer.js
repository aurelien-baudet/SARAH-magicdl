/**
 * Player that does nothng
 */
function NullPlayer() {
}

/**
 * Does nothing
 * 
 * @param item
 */
NullPlayer.prototype.play = function(/*Item*/item) {
	// nothing to do
}


module.exports = NullPlayer;