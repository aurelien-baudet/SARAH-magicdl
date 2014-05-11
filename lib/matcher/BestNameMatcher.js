var similarity = require('../util/similarity');


/**
 * Matcher that tries to find the most common part between the name of the item and the specific download system
 * file name
 * 
 * @param nameAccessor			an optional function used to access the name of the item
 */
function BestNameMatcher(/*Function*/nameAccessor) {
	this.nameAccessor = nameAccessor || function(obj) { return obj; };
}


/**
 * Walk through the whole list and count the common words with the provided item.
 * The list item with the higher count will be returned.
 * If there is nothing in common, then null is returned.
 * 
 * @param item			the item which we want to get the associated list item
 * @param list			the list that contains potential matches
 * @returns the best matching item if any, null otherwise
 */
BestNameMatcher.prototype.match = function(/*Item*/item, /*Array*/list) {
	// normalize item.getName()
	var itemName = this.normalize(item.getName());
	var normalizedName = similarity.normalize(itemName);
	// split on spaces
	var parts = itemName.replace(normalizedName, "").split(/\s+/);
	var best = null;
	var max = 0;
	for(var i=0, l=list.length ; i<l ; i++) {
		// normalize list[field]
		var name = this.normalize(this.nameAccessor(list[i]));
		// compare with normalizedName
		if(name.indexOf(normalizedName)!=-1) {
			var count = 0;
			// count common words
			for(var j=0, k=parts.length ; j<k ; j++) {
				if(name.indexOf(parts[j])!=-1) {
					count++;
				}
			}
			if(best==null || count>max) {
				// best match is the one with higher count
				best = list[i];
				max = count;
			}
		}
	}
	return best;
}

/**
 * Normalize a string by removing all useless characters
 * 
 * @param name			the name to normalize
 * @returns the normalized name
 */
BestNameMatcher.prototype.normalize = function(name) {
	return name.replace(/[²&~#"{\[(|\\_^\])}=.:?,;!\/\-]/gi, " ").replace(/\s{2,}/g, " ").trim().toLowerCase();
}

module.exports = BestNameMatcher;