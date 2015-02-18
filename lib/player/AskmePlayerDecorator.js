var string = require('../util/string');

/**
 * Player that ask to the user for playing. If the user accepts playing, then it delegates the play action
 * to the decorated player.
 * 
 * @param sarahContext		the SARAH context (references to SARAH, callback, config, data, directory, downloadConf, managerConf)
 * @param player			the decorated player
 * @param message			the message that SARAH will ask to the user
 * @param grammar			the expected responses
 */
function AskmePlayerDecorator(/*Object*/sarahContext, /*Player*/player, /*String*/message, /*Map?*/grammar) {
	this.sarahContext = sarahContext;
	this.player = player;
	this.message = message;
	this.grammar = grammar || {
		"Oui" : "o",
		"vas-y": "o",
		"Non" : "",
		"pas maintenant": ""
	};
}


/**
 * Ask to the user if the video must be played
 * 
 * @param item			the item to ask for
 */
AskmePlayerDecorator.prototype.play = function(/*Item*/item) {
	this.sarahContext.SARAH.askme(string.substitute(this.message, item), this.grammar, 15000, function(item, answer, end) {
		end();
		if(answer) {
			this.player.play(item);
		}
	}.bind(this, item));
}


module.exports = AskmePlayerDecorator;