var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	similarity = require('../util/similarity');


/**
 * Filter that asks to the user to accept or reject the item
 * 
 * @param sarahContext			the context that contains SARAH
 */
function AskFilter(/*Object*/sarahContext) {
	this.sarahContext = sarahContext;
	this.stopped = false;
	EventEmitter.call(this);
}

util.inherits(AskFilter, EventEmitter);


/**
 * Check if the item is accepted or rejected.
 * Aggregate all items that are similar to avoid asking several times for the same item.
 * SARAH will then ask you accept the item.
 * 
 * @param item			the item to check acceptance
 * @param idx			the index of the item into the full array
 * @param items			the full list of items
 */
AskFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	if(idx==0) {
		// reset
		this.filteredArray = [];
		this.stopped = false;
	}
	// aggregate same results
	// TODO: and ask which version to download instead of first one ?
	if(!this.stopped && similarity.indexOf(this.filteredArray.map(function(item) { return item.getName(); }), item.getName())==-1) {
		this.filteredArray.push(item);
		// TODO: add possibility to ask description for the item and make SARAH read it
		this.sarahContext.SARAH.askme("Veux-tu télécharger "+item.getSpeakName()+" ?", {
			"Oui" : "o",
			"vas-y": "o",
			"Non" : "",
			"pas maintenant": "",
			"stop": "stop",
			"ta gueule": "stop",
			"tais toi": "stop"
		}, 15000, function(item, answer, end) {
			end();
			this.stopped = answer=="stop";
			this.emit(answer ? 'accepted' : 'rejected', item);
			this.emit('done', item);
		}.bind(this, item));
	} else {
		setTimeout(this.emit.bind(this, 'rejected', item), 0);
		setTimeout(this.emit.bind(this, 'done', item), 0);
	}
}


module.exports = AskFilter;