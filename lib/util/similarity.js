var USELESS_PREFIX = /^(\[.+\])/gi;
var USELESS_SUFFIX = /(VOSTFR|FRENCH|HDTV|XVID|BRRip|x264|HDRIP|AC3|R5|TiTAN| CAM |AAC-SeedPeer|DVDRIP|WEBRIP|HDTS|BDRip|DVD|BluRay|\.avi|\.mkv|ACAB|720p|420p|1080p|576p|READNFO|Hindi Movie( [0-9]+MB)?|\[.+\]|\w+ Subs).*$/gi;
var USELESS_CHARACTERS = /[²&~#"{\[(|\\_^\])}=.:?,;!\/\-]/gi;
var SERIE_INFORMATION = /S0?([0-9]+)E([0-9]+)/i;
var YEAR_INFORMATION = / (20|19)[0-9]{2}$/i;
var MULTIPLE_SPACES = /\s{2,}/g;


/**
 * Compute similarity between two strings.
 * If similarity is over the minimum value then strings are considered as similar.
 * 
 * @param a				the first string
 * @param b				the second string
 * @param min			optional minimum value (default to 0.75)
 * @returns true if strings are similar, false otherwise
 */
var isSimilar = function(/*String*/a, /*String*/b, /*Float*/min) {
	return score(a, b)>=(min || 0.75);
}

/**
 * Compute similarity score between two strings.
 * 
 * @param a				the first string
 * @param b				the second string
 * @returns the similarity score (0 => no similarity at all, 1 => identical)
 */
var score = function(/*String*/a, /*String*/b) {
	return jaccard(wordsOccurrences(normalize(a)), wordsOccurrences(normalize(b)));
}

/**
 * Filter an array of strings to get only unique normalized string.
 * Comparison is done using similarity computation
 * 
 * @param strings			the list of strings to filter
 * @returns a new array with unique normalized strings
 */
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

/**
 * Get the index of a string in a list.
 * The comparison is done using similarity computation
 * 
 * @param strings			the list where to find the provided string
 * @param str				the string to search into the array
 * @param start				optional start index for search (default to 0)
 * @returns true if the string is similar to another in the array of strings, false otherwise
 */
var indexOf = function(/*Array*/strings, /*String*/str, /*Integer?*/start) {
	for(var i=start || 0, l=strings.length ; i<l ; i++) {
		if(isSimilar(str, strings[i])) {
			return i;
		}
	}
	return -1;
}

/**
 * Algorithm that compute intersection and union between two map of words.
 * The result is the division of intersection by union.
 * 
 * @param words1			a map indexed by words and value is the number of occurrences
 * @param words2			a map indexed by words and value is the number of occurrences
 * @returns the Jaccard similarity score
 */
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

/**
 * Generate a map of word occurrences from the provided string.
 * 
 * @param str			the string used to count words
 * @returns a map of word occurrences
 */
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

/**
 * Normalize a string by removing all useless characters
 * 
 * @param str			the string to normalize
 * @returns the normalized string
 */
var normalize = function(/*String*/str) {
	// remove all useless words
	// remove all useless characters and replace them by spaces
	// replace multiple spaces by only one space
	return str.replace(USELESS_PREFIX, "").replace(USELESS_SUFFIX, "").replace(USELESS_CHARACTERS, " ").replace(MULTIPLE_SPACES, " ").trim().replace(YEAR_INFORMATION, "").toLowerCase();
}

module.exports = {
	USELESS_PREFIX: USELESS_PREFIX,
	USELESS_SUFFIX: USELESS_SUFFIX,
	SERIE_INFORMATION: SERIE_INFORMATION,
	score: score,
	normalize: normalize,
	isSimilar: isSimilar,
	filter: filter,
	indexOf: indexOf
}