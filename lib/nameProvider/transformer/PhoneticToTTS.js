var EventEmitter = require('events').EventEmitter,
	util = require('util');


/**
 * Convert phonetic characters to target language sounds
 * 
 * @param lang				the target language
 */
function PhoneticToTTS(/*String?*/lang) {
	this.rules = require('./rules/'+(lang || 'fr')).rules;
	EventEmitter.call(this);
}

util.inherits(PhoneticToTTS, EventEmitter);


/**
 * Transform the provided name.
 * 
 * @param item				the item concerned by the transformation
 * @param name				the name to transform
 */
PhoneticToTTS.prototype.transform = function(/*Item*/item, /*String*/name) {
	var rules = this.rules;
	for(var i=0, l=rules.length ; i<l ; i++) {
		var rule = rules[i];
		name = name.replace(rule.regexp, rule.replacement);
	}
	setTimeout(this.emit.bind(this, 'done', item, name.toLowerCase()), 0);
}


module.exports = PhoneticToTTS;