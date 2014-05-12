var Photransedit = require("../lib/nameProvider/transformer/Photransedit"),
	Item = require('../lib/Item');

exports.testPhotransedit = function(test) {
	var transformer = new Photransedit();
	transformer.transform(new Item("game of thrones"), "game of thrones");
	transformer.on('done', function(item, name) {
		debugger;
		test.done();
	});
}