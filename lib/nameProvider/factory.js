var CompoundNameProvider = require('./CompoundNameProvider'),
	TrimNameProvider = require('./TrimNameProvider'),
	RegexpNameProvider = require('./RegexpNameProvider'),
	LowerCaseNameProvider = require('./LowerCaseNameProvider'),
	similarity = require('../util/similarity');

	
module.exports = {
	moviesShortName: function() {
		return new CompoundNameProvider(
				new RegexpNameProvider(similarity.USELESS_PREFIX, ""), 
				new RegexpNameProvider(similarity.USELESS_SUFFIX, ""), 
				new RegexpNameProvider(similarity.USELESS_CHARACTERS, " "), 
				new RegexpNameProvider(similarity.MULTIPLE_SPACES, " "), 
				new TrimNameProvider(),
				new RegexpNameProvider(similarity.YEAR_INFORMATION, ""),
				new LowerCaseNameProvider());
	},
	
	seriesShortName: function() {
		return new CompoundNameProvider(
				new RegexpNameProvider(similarity.SERIE_INFORMATION, ""), 
				new RegexpNameProvider(similarity.USELESS_PREFIX, ""), 
				new RegexpNameProvider(similarity.USELESS_SUFFIX, ""), 
				new RegexpNameProvider(similarity.USELESS_CHARACTERS, " "), 
				new RegexpNameProvider(similarity.MULTIPLE_SPACES, " "), 
				new TrimNameProvider(),
				new LowerCaseNameProvider());
	},
	
	seriesLongName: function() {
		return new CompoundNameProvider(
				new RegexpNameProvider(similarity.SERIE_INFORMATION, "saison $1 épisode $2"), 
				new RegexpNameProvider(/VOSTFR/, "version originale sous titrée"), 
				new RegexpNameProvider(/FRENCH/, "version française"), 
				new RegexpNameProvider(similarity.USELESS_PREFIX, ""), 
				new RegexpNameProvider(similarity.USELESS_SUFFIX, ""), 
				new RegexpNameProvider(similarity.USELESS_CHARACTERS, " "), 
				new RegexpNameProvider(similarity.MULTIPLE_SPACES, " "), 
				new TrimNameProvider(),
				new LowerCaseNameProvider());
	}
}