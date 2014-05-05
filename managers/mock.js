var MockSearch = require('../lib/search/MockSearch'),
	AcceptFilter = require('../lib/filter/AcceptFilter'),
	NullNameProvider = require('../lib/nameProvider/NullNameProvider'),
	NullUrlProvider = require('../lib/urlProvider/NullUrlProvider'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/Manager'),
	fs = require('fs'),
	util = require('util');
	

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

module.exports = Mock;