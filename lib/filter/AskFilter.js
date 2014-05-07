var EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Filter that asks to the user to accept or reject the item
 * 
 * @param sarahContext			the context that contains SARAH
 */
function AskFilter(/*Object*/sarahContext) {
	this.sarahContext = sarahContext;
	EventEmitter.call(this);
}

util.inherits(AskFilter, EventEmitter);


/**
 * Check if the item is accepted or rejected
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the fulle list of items
 */
AskFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	// TODO: add possibility to ask description for the item and make SARAH read it
	this.sarahContext.SARAH.askme("Veux-tu télécharger "+item.getSpeakName()+" ?", {
	  "Oui" : "o",
	  "vas-y": "o",
	  "Non" : "",
	  "pas maintenant": ""
	}, 15000, function(answer, end) {
		end();
		this.emit(answer ? 'accepted' : 'rejected', item);
		this.emit('done', item);
	}.bind(this));
}


module.exports = AskFilter;