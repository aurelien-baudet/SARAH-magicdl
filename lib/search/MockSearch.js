var Item = require('../Item'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

MockSearch = function() {
	EventEmitter.call(this);
}


util.inherits(MockSearch, EventEmitter);


MockSearch.prototype.search = function() {
	var foundItems = [
		new Item("movie 1", "http://thepiratebay/movie1.torrent"),
		new Item("[foo] movie.2.with.unspeakablename.XVID", "http://anypage/movie2.html")
	];
	setTimeout(this.emit.bind(this, 'done', foundItems), 0);
}


module.exports = MockSearch;
