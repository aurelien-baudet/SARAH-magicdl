var USELESS_WORDS = /(VOSTFR|FRENCH|HDTV|XVID|BRRip|x264|HDRIP|AC3|R5|TiTAN| CAM |AAC-SeedPeer|DVDRIP|WEBRIP|HDTS|BDRip|DVD|BluRay|\.avi|\.mkv|ACAB|720p|420p|1080p|576p|READNFO|Hindi Movie( [0-9]+MB)?|\[.+\]|\w+ Subs).*$/gi;
var USELESS_CHARACTERS = /[²&~#"{\[(|\\_^\])}=.:?,;!\/\-]/gi;
var SERIE_INFORMATION = /S0?([0-9]+)E([0-9]+)/i;
var YEAR_INFORMATION = / (20|19)[0-9]{2}$/i;
var MULTIPLE_SPACES = /\s{2,}/g;


var isSimilar = function(/*String*/a, /*String*/b) {
	return similarity(a, b)>=0.75;
}

var similarity = function(/*String*/a, /*String*/b) {
	return jaccard(wordsOccurrences(normalize(a)), wordsOccurrences(normalize(b)));
}

var filter = function(/*Array*/strings) {
	var arr = [];
	for(var i=0, l=strings.length ; i<l ; i++) {
		var str = strings[i];
		if(indexOf(arr, str)==-1) {
			arr.push(normalize(str));
		}
	}
	return arr;
}

var indexOf = function(/*Array*/strings, /*String*/str, /*Integer*/start) {
	for(var i=start || 0, l=strings.length ; i<l ; i++) {
		if(isSimilar(str, strings[i])) {
			return i;
		}
	}
	return -1;
}

var jaccard = function(/*Object*/words1, /*Object*/words2) {
	var intersection = 0;
	var union = 0;
	for(var word in words1) {
		var count = words1[word];
		union += count;
		if(words2[word]) {
			intersection += count + words2[word];
		}
	}
	for(var word in words2) {
		var count = words2[word];
		union += count;
	}
	return intersection/union;
}

var wordsOccurrences = function(/*String*/str) {
	var words = str.split(/ /);
	var map = {};
	for(var i=0, l=words.length ; i<l ; i++) {
		var w = words[i];
		if(!map[w]) {
			map[w] = 1;
		} else {
			map[w]++;
		}
	}
	return map;
}

var normalize = function(/*String*/str) {
	// remove all useless words
	// remove all useless characters and replace them by spaces
	// replace multiple spaces by only one space
	return str.replace(USELESS_WORDS, "").replace(USELESS_CHARACTERS, " ").replace(MULTIPLE_SPACES, " ").trim().replace(YEAR_INFORMATION, "").toLowerCase();
}

module.exports = {
	USELESS_WORDS: USELESS_WORDS,
	SERIE_INFORMATION: SERIE_INFORMATION,
	similarity: similarity,
	normalize: normalize,
	isSimilar: isSimilar,
	filter: filter,
	indexOf: indexOf
}