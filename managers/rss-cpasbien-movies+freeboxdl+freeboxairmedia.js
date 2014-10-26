var RssSearch = require('../lib/search/RssSearch'),
	SiteSearch = require('../lib/search/SiteSearch')
	siteParserFactory = require('../lib/search/siteParserFactory'),
	AndFilter = require('../lib/filter/AndFilter'),
	AskFilter = require('../lib/filter/AskFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	urlProviderFactory = require('../lib/urlProvider/urlProviderFactory'),
	FreeboxDownloader = require('../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../lib/player/FreeboxAirMedia'),
	Manager = require('../lib/manager/StepByStepManager'),
	JsonStore = require('../lib/store/JsonStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	FreeboxDetector = require('../lib/capabilities/FreeboxDetector'),
	NullNotifier = require('../lib/notify/NullNotifier'),
	SpeakNotifier = require('../lib/notify/SpeakNotifier'),
	PushingBoxNotifier = require('../lib/notify/PushingBoxNotifier'),
	AskmePlayerDecorator = require('../lib/player/AskmePlayerDecorator');
	

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
function RssCpasbienMoviesFreebox(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	var freeboxConf = JSON.parse(require('fs').readFileSync(directory+'tmp/freeboxApp.json', 'utf8'));
	Manager.apply(this, [
		sarahContext,
//		new RssSearch("http://www.cpasbien.pe/flux_rss.php?mainid=films"),
		new SiteSearch("http://www.cpasbien.pe/derniers-torrents.php?filtre=films", ".torrent-aff", siteParserFactory.cpasbien),
		new AndFilter(new UnreadFilter(new JsonStore(directory+'tmp/unread.json')), new AskFilter(sarahContext)),
		nameProviderFactory.moviesShortName(),		// short name: remove all useless information that is not understandable when earing it
		urlProviderFactory.cpasbien(),
		new FreeboxDownloader(freeboxConf, new BestNameMatcher(function(download) { return download.name; }), conf.list),
		new AskmePlayerDecorator(sarahContext, new FreeboxAirMedia(freeboxConf), '${getSpeakName()} est téléchargé. Veux-tu le regarder maintenant ?'),
		{
			nothing: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, 'Rien à télécharger'),
			downloadStarted: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, '${getSpeakName()} en cours de téléchargement'),
			downloaded: new NullNotifier()
		}
	]);
}

util.inherits(RssCpasbienMoviesFreebox, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
RssCpasbienMoviesFreebox.initialize = function(initCtx) {
	var appFile = initCtx.directory+'tmp/freeboxApp.json';
	FreeboxDownloader.initialize(initCtx, appFile);
	FreeboxDownloader.ee.once('done', function(appInfo) {
		if(appInfo) {
			FreeboxAirMedia.initialize(initCtx, appFile);
			FreeboxAirMedia.ee.once('done', RssCpasbienMoviesFreebox.ee.emit.bind(RssCpasbienMoviesFreebox.ee, 'done'));
		}
	});
}

RssCpasbienMoviesFreebox.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
RssCpasbienMoviesFreebox.detect = function(detectCtx) {
	new FreeboxDetector().detect().on('available', RssCpasbienMoviesFreebox.ee.emit.bind(RssCpasbienMoviesFreebox.ee, 'available'));
}


module.exports = RssCpasbienMoviesFreebox;
