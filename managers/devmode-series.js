var RssSearch = require('../lib/search/RssSearch'),
	SiteSearch = require('../lib/search/SiteSearch')
	siteParserFactory = require('../lib/search/siteParserFactory'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	HtmlRegexpUrlProvider = require('../lib/urlProvider/HtmlRegexpUrlProvider'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/manager/FullAsyncManager'),
	MemoryStore = require('../lib/store/MemoryStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	EnvironmentVariableDetector = require('../lib/capabilities/EnvironmentVariableDetector');
	

/**
 * Manager that:
 *    - searches series on www.cpasbien.me
 *    - filters results using a list of regular expressions
 *    - fake download
 *    - fake play
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function SeriesDevMode(sarahContext) {
	var conf = sarahContext.managerConf;
	Manager.apply(this, [
		sarahContext,
//		new RssSearch("http://www.cpasbien.pe/flux_rss.php?mainid=series"),
		new SiteSearch("http://www.cpasbien.pe/derniers-torrents.php?filtre=series", ".torrent-aff", siteParserFactory.cpasbien),
		new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new MemoryStore())),
		nameProviderFactory.seriesShortName(),
		new HtmlRegexpUrlProvider(/href="(.+permalien=[^"]+)"/, "http://www.cpasbien.pe"),
		new MockDownloader(),
		new MockPlayer()
	]);
}

util.inherits(SeriesDevMode, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
SeriesDevMode.initialize = function(initCtx) {
	setTimeout(SeriesDevMode.ee.emit.bind(SeriesDevMode.ee, 'done'), 0);
}

SeriesDevMode.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
SeriesDevMode.detect = function(detectCtx) {
	new EnvironmentVariableDetector("MAGICDL_MODE", "dev").detect().on('available', SeriesDevMode.ee.emit.bind(SeriesDevMode.ee, 'available'));
}


module.exports = SeriesDevMode;
