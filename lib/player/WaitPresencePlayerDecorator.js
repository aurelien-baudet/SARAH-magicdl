function WaitPresencePlayerDecorator(sarahContext, player, presenceDetector, store) {
	this.sarahContext = sarahContext;
	this.player = player;
	this.presenceDetector = presenceDetector;
	this.store = store;
	this.register();
}

/**
 * Connect to the presence event in order to trigger ask function
 */
WaitPresencePlayerDecorator.prototype.register = function() {
	this.presenceDetector.on('presence', this.ask.bind(this));
}


/**
 * Method implemented for matching the interface. No real play here, just save the item for future play
 * 
 * @param item the item to save
 */
WaitPresencePlayerDecorator.prototype.play = function(/*Item*/item) {
	// save the item for future playing when presence is detected
	this.store.save(item.id, item);
}

/**
 * A presence has been detected => ask for playing
 */
WaitPresencePlayerDecorator.prototype.ask = function() {
	// TODO: disable presence detection while playing in order to avoid interrupting current playing
	// get the waiting items, walk through until one or none is accepted
	var waitings = this.store.getMap();
	var items = [];
	for(var id in waitings) {
		items.push(waitings[id]);
	}
	this.next(items, 0);
}

/**
 * Ask for next item if there is any item to play. If user accepts, then do real play
 * 
 * @param items the list of items that were previously waiting for playing
 * @param idx the current index in the list
 */
WaitPresencePlayerDecorator.prototype.next = function(/*Array*/items, /*Integer*/idx) {
	if(items.length>0) {
		var item = items[idx];
		this.sarahContext.SARAH.askme("Veux-tu regarder "+item.getSpeakName()+" ?", {
			"Oui" : "o",
			"vas-y": "o",
			"Non" : "",
			"pas maintenant": ""
		}, 15000, function(item, answer, end) {
			end();
			if(answer) {
				this.store.remove(item.id);
				this.player.play(item);
			} else {
				this.next(items, idx+1);
			}
		}.bind(this, item));
	}
}


module.exports = WaitPresencePlayerDecorator;