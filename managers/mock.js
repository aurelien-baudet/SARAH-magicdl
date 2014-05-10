var MockSearch = require('../lib/search/MockSearch'),
	AcceptFilter = require('../lib/filter/AcceptFilter'),
	NullNameProvider = require('../lib/nameProvider/NullNameProvider'),
	NullUrlProvider = require('../lib/urlProvider/NullUrlProvider'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/Manager'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;
	

function Mock(sarahContext) {
	Manager.apply(this, [
		sarahContext,
		new MockSearch(),
		new AcceptFilter(),
		new NullNameProvider(),
		new NullUrlProvider(),
		new MockDownloader(),
		new MockPlayer()
	]);
}

util.inherits(Mock, Manager);


Mock.initialize = function(initCtx) {
	
}


Mock.ee = new EventEmitter();

Mock.detect = function(detectCtx) {
	setTimeout(Mock.ee.emit.bind(Mock.ee, 'available', true), 0);
}

module.exports = Mock;