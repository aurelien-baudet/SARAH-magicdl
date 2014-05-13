var Photransedit = require("../lib/nameProvider/transformer/Photransedit"),
	PhoneticToTTS = require("../lib/nameProvider/transformer/PhoneticToTTS"),
	Item = require('../lib/Item');


exports.testPhotransedit = function(test) {
	var transformer = new Photransedit();
	transformer.transform(new Item("game of thrones"), "game of thrones");
	transformer.on('done', function(item, name) {
		debugger;
		test.done();
	});
}

exports.testPhoneticToTTS = function(test) {
	var transformer = new PhoneticToTTS();
	transformer.transform(new Item("game of thrones"), "| ɡeɪm əv θrəʊnz |");
	transformer.on('done', function(item, name) {
		debugger;
		SARAH.speak(name, function() {
			test.done();
		});
	});
}