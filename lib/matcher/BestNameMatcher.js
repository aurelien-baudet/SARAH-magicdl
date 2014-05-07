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
	// normalize list[field]
	// compare with item.getSpeakName()
	// split on spaces
	// count common words
	// best match is the one with higher count
	// TODO: manage case if the name is modified for better dictation (example: Game of thrones -> speak name = Game of ssrones)
	var itemName = this.normalize(item.getName());
	var speakName = this.normalize(item.getSpeakName());
	var parts = itemName.replace(speakName, "").split(/\s+/);
	var best = -1;
	var max = 0;
	for(var i=0, l=list.length ; i<l ; i++) {
		var name = this.normalize(this.nameAccessor(list[i]));
		if(name.indexOf(speakName)!=-1) {
			var count = 0;
			for(var j=0, k=parts.length ; j<k ; j++) {
				if(name.indexOf(parts[j])!=-1) {
					count++;
				}
			}
			if(best==-1 || count>max) {
				best = i;
				max = count;
			}
		}
	}
	return best==-1 ? null : list[best];
}

BestNameMatcher.prototype.normalize = function(name) {
	return name.replace(/\./ig, " ").trim().toLowerCase();
}

module.exports = BestNameMatcher;