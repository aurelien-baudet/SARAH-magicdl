var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	cheerio = require('cheerio'),
	request = require('request');


/**
 * Transformer that convert english text to phonetic. The advantage of using phonetic is that you
 * can convert any language to phonetic and then convert phonetic to equivalent sounds in another language
 */
function Photransedit() {
	this.url = "http://www.photransedit.com/online/txt2phntx.aspx?tlt=Text to Phonetics:&tcl=316394&bgc=FFFFFF&lng=bre&spc=true&rst=false&pun=false&syc=true&rcr=false&inr=true&syl=false";
	EventEmitter.call(this);
}

util.inherits(Photransedit, EventEmitter);


/**
 * Transform the provided name.
 * Photransedit has a security check that prevents posting data directly to the server and get the response
 * We must get the web page that contains the form that contains hidden fields used for security checking
 * Then we can post the form values
 * 
 * @param item				the item concerned by the transformation
 * @param name				the name to transform
 */
Photransedit.prototype.transform = function(/*Item*/item, /*String*/name) {
	this.loadSite(item, name);
}

/**
 * Load the website form and get the values.
 * 
 * @param item				the item concerned by the transformation
 * @param name				the name to transform
 */
Photransedit.prototype.loadSite = function(/*Item*/item, /*String*/name) {
	// Photransedit has a security check that prevents posting data directly to the server and get the response
	// We must get the web page that contains the form that contains hidden fields used for security checking
	// Then we can post the form values
	request(this.url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			var form = {};
			// get the form values including security fields
			$('input, textarea').each(function(index, element) {
				form[$(element).attr('name')] = $(element).val();
			});
			// change the text to convert with the provided name
			form["txtText"] = name;
			// post the form and get the value
			this.sendForm(form, item, name);
		} else {
			console.error(error);
		}
	}.bind(this));
}


/**
 * Post the form values and read the response. Trigger 'done' event with the phonetic transcription
 * 
 * @param form				the form content to post
 * @param item				the item concerned by the transformation
 * @param name				the name to transform
 */
Photransedit.prototype.sendForm = function(/*Object*/form, /*Item*/item, /*String*/name) {
	request({
		url: this.url,
		method: 'POST',
		form: form
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = cheerio.load(body);
			this.emit('done', item, $('#txtTranscription').val().trim());
		} else {
			console.error(error);
		}
	}.bind(this));
}

module.exports = Photransedit;