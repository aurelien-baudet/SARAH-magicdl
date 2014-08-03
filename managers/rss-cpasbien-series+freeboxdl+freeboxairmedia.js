var RssSearch = require('../lib/search/RssSearch'),
	SiteSearch = require('../lib/search/SiteSearch')
	siteParserFactory = require('../lib/search/siteParserFactory'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	urlProviderFactory = require('../lib/urlProvider/urlProviderFactory'),
	FreeboxDownloader = require('../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../lib/player/FreeboxAirMedia'),
	Manager = require('../lib/manager/FullAsyncManager'),
	JsonStore = require('../lib/store/JsonStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	FreeboxDetector = require('../lib/capabilities/FreeboxDetector');
	

/**
 * Manager that:
 *    - searches series on www.cpasbien.me
 *    - filters results using a list of regular expressions
 *    - downloads the found items using Freebox
 *    - plays them using Freebox
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function RssCpasbienSeriesFreebox(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	var freeboxConf = JSON.parse(require('fs').readFileSync(directory+'tmp/freeboxApp.json', 'utf8'));
	Manager.apply(this, [
		sarahContext,
//		new RssSearch("http://www.cpasbien.pe/flux_rss.php?mainid=series"),
		new SiteSearch("http://www.cpasbien.pe/derniers-torrents.php?filtre=series", ".torrent-aff", siteParserFactory.cpasbien),
		new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new JsonStore(directory+'tmp/unread.json'))),
		nameProviderFactory.seriesShortName(),
		urlProviderFactory.cpasbien(),
		new FreeboxDownloader(freeboxConf, new BestNameMatcher(function(download) { return download.name; }), conf.list),
		new FreeboxAirMedia(freeboxConf)
	]);
}

util.inherits(RssCpasbienSeriesFreebox, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
RssCpasbienSeriesFreebox.initialize = function(initCtx) {
	var appFile = initCtx.directory+'tmp/freeboxApp.json';
	FreeboxDownloader.initialize(initCtx, appFile);
	FreeboxDownloader.ee.once('done', function(appInfo) {
		if(appInfo) {
			FreeboxAirMedia.initialize(initCtx, appFile);
			FreeboxAirMedia.ee.once('done', RssCpasbienSeriesFreebox.ee.emit.bind(RssCpasbienSeriesFreebox.ee, 'done'));
		}
	});
}

RssCpasbienSeriesFreebox.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
RssCpasbienSeriesFreebox.detect = function(detectCtx) {
	new FreeboxDetector().detect().on('available', RssCpasbienSeriesFreebox.ee.emit.bind(RssCpasbienSeriesFreebox.ee, 'available'));
}


module.exports = RssCpasbienSeriesFreebox;
