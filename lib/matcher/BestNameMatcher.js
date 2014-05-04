function BestNameMatcher(nameAccessor) {
	this.nameAccessor = nameAccessor || function(obj) { return obj; };
}


BestNameMatcher.prototype.match = function(item, list) {
	// normalize item.getName()
	// normalize list[field]
	// compare with item.getSpeakName()
	// split on spaces
	// count common words
	// best match is the one with higher count
	// TODO: manage case if the name is modified for better dictation (example: Game of thrones -> speak name = Game of ssrones)
	var itemName = this.normalize(item.getName());
	var speakName = item.getSpeakName().toLowerCase();
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
	return name.replace(/\./ig, " ").toLowerCase();
}

module.exports = BestNameMatcher;