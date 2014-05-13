var RssSearch = require('../lib/search/RssSearch'),
	SiteSearch = require('../lib/search/SiteSearch')
	siteParserFactory = require('../lib/search/siteParserFactory'),
	AndFilter = require('../lib/filter/AndFilter'),
	AskFilter = require('../lib/filter/AskFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	HtmlRegexpUrlProvider = require('../lib/urlProvider/HtmlRegexpUrlProvider'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/manager/StepByStepManager'),
	MemoryStore = require('../lib/store/MemoryStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	EnvironmentVariableDetector = require('../lib/capabilities/EnvironmentVariableDetector');
	

/**
 * Manager that:
 *    - searches series on www.cpasbien.me
 *    - filters results by asking user
 *    - fake download
 *    - fake play
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function MoviesDevMode(sarahContext) {
	Manager.apply(this, [
		sarahContext,
//		new RssSearch("http://www.cpasbien.pe/flux_rss.php?mainid=films"),
		new SiteSearch("http://www.cpasbien.pe/derniers-torrents.php?filtre=films", ".torrent-aff", siteParserFactory.cpasbien),
		new AndFilter(new UnreadFilter(new MemoryStore()), new AskFilter(sarahContext)),
		nameProviderFactory.moviesShortName(),		// short name: remove all useless information that is not understandable when earing it
		new HtmlRegexpUrlProvider(/href="(.+permalien=[^"]+)"/, "http://www.cpasbien.pe"),
		new MockDownloader(),
		new MockPlayer()
	]);
}

util.inherits(MoviesDevMode, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
MoviesDevMode.initialize = function(initCtx) {
}

MoviesDevMode.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
MoviesDevMode.detect = function(detectCtx) {
	new EnvironmentVariableDetector("MAGICDL_MODE", "dev").detect().on('available', MoviesDevMode.ee.emit.bind(MoviesDevMode.ee, 'available'));
}


module.exports = MoviesDevMode;
