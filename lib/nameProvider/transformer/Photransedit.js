var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	cheerio = require('cheerio'),
	request = require('request'),
	spawn = require('child_process').spawn;


function Photransedit() {
	this.url = "http://www.photransedit.com/online/text2phonetics.aspx";
	EventEmitter.call(this);
}

util.inherits(Photransedit, EventEmitter);



Photransedit.prototype.transform = function(/*Item*/item, /*String*/name) {
	var child = spawn(__dirname+'/../../../../../PhantomJS/phantomjs.exe', [__dirname+'/phantom.js']);
	child.stderr.on('data', function(data) {
		console.error(new Buffer(data).toString('utf8'));
	});
	child.stdout.on('data', function (data) {
		console.log(new Buffer(data).toString('utf8'));
		debugger;
	});
	child.stdin.end();
//	var webpage = require('webpage');
//	var page = webpage.create();
//	var filled = false;
////	var page = new WebPage();
//	page.onLoadFinished = function() {
//		debugger;
//		if(!page.____filled) {
//			page.evaluate(this.fill.bind(this, item, name, page));
//		} else {
//			page.evaluate(this.read.bind(this, item, name, page));
//		}
//	};
//	page.open(this.url);
//	
//	// Scrap
//	scraper.scrap(this.url, {}, function(options, results) {
//		debugger;
//		// Play with jQuery and set tts
//		$('#MainContent_txtText').text("name");
//		$('input[value="Transcribe"]').click();
//	});
}

var phantomCode = function() {
}


Photransedit.prototype.fill = function(/*Item*/item, /*String*/name, /*WebPage*/page) {
	document.querySelector('#MainContent_txtText').value = name;
	document.querySelector('input[value="Transcribe"]').click();
	page.____filled = true;
}


Photransedit.prototype.read = function(/*Item*/item, /*String*/name, /*WebPage*/page) {
	var newName = document.querySelector('#MainContent_txtText').value = name;
	this.emit('done', item, newName);
	page.close();
}

module.exports = Photransedit;