console.log("start");	
var webpage = require('webpage');
var page = webpage.create();
var filled = false;
page.onLoadFinished = function() {
	console.log("page loaded "+filled);
	if(!filled) {
		filled = page.evaluate(function() {
			document.getElementById('MainContent_txtText').value = "game of thrones";
			document.querySelector('input[value="Transcribe"]').click();
			return true;
		});
	} else {
		console.log("get text");
		var newName = page.evaluate(function() {
			return document.getElementById('MainContent_txtTranscription').value;
		});
		console.log("newName="+newName);
		page.close();
	}
};
console.log("open");
page.open("http://www.photransedit.com/online/text2phonetics.aspx");
