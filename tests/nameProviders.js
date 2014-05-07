var TrimNameProvider = require("../lib/nameProvider/TrimNameProvider"),
	Item = require("../lib/Item");


exports.testTrimNameMatcher = function(test) {
	var provider = new TrimNameProvider();
	provider.setSpeakName(new Item("    name with spaces    "));
	provider.on('done', function(item) {
		test.equal(item.getSpeakName(), "name with spaces");
		test.done();
	});
}


