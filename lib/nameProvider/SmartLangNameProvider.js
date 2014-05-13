var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	LanguageDetect = require('languagedetect'),
	CompoundTransformer = require('./transformer/CompoundTransformer'),
	Photransedit = require('./transformer/Photransedit'),
	PhoneticToTTS = require('./transformer/PhoneticToTTS');
	

/**
 * Name provider that detects the language used in the name, transform words from other languages to specified language
 * 
 * @param detector			optional detector used to detect speak name language (default to LanguageDetect)
 * @param transformer		optional transformer used to convert foreign text to speakable name in target language (default to Phototransedit + PhoneticToTTS)
 * @param lang				optional target language (default to "fr")
 */
function SmartLangNameProvider(/*LanguageDetector?*/detector, /*Transformer?*/transformer, /*String?*/lang) {
	this.lang = lang || "fr";
	this.detector = detector || new LanguageDetect();
	this.transformer = new CompoundTransformer(new Photransedit(), new PhoneticToTTS(this.lang));
	this.transformer.on('done', this.transformed.bind(this));
	EventEmitter.call(this);
}

util.inherits(SmartLangNameProvider, EventEmitter);

/**
 * Update the speak name for the item
 * 
 * @param item			the item to update
 */
SmartLangNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	var name = item.getSpeakName();
	// TODO: make it async
	var languages = this.detector.detect(name);
	if(languages.length) {
		var language = languages[0][0];
		this.transformer.transform(item, name);
	} else {
		setTimeout(this.emit.bind(this, 'done', item), 0);
	}
}

/**
 * Fired when the name has been transformed
 * 
 * @param item			the item concerned by the transformation
 * @param name			the transformed name
 */
SmartLangNameProvider.prototype.transformed = function(/*Item*/item, /*String*/name) {
	item.setSpeakName(name);
	this.emit('done', item);
}


SmartLangNameProvider.prototype.toString = function() {
	return "SmartLangNameProvider[lang="+this.lang+"]";
}


module.exports = SmartLangNameProvider;