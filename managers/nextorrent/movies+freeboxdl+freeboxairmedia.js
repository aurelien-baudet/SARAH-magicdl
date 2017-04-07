var SiteSearch = require('../../lib/search/SiteSearch'),
	config = require('../../lib/config/nextorrent'),
	AndFilter = require('../../lib/filter/AndFilter'),
	AskFilter = require('../../lib/filter/AskFilter'),
	UnreadFilter = require('../../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../../lib/nameProvider/factory'),
	FreeboxDownloader = require('../../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../../lib/player/FreeboxAirMedia'),
	Manager = require('../../lib/manager/NotificationDecorator'),
	StepByStepManager = require('../../lib/manager/StepByStepManager'),
	JsonStore = require('../../lib/store/JsonStore'),
	BestNameMatcher = require('../../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	FreeboxDetector = require('../../lib/capabilities/FreeboxDetector'),
	NullNotifier = require('../../lib/notify/NullNotifier'),
	SpeakNotifier = require('../../lib/notify/SpeakNotifier'),
	PushingBoxNotifier = require('../../lib/notify/PushingBoxNotifier'),
	AskmePlayerDecorator = require('../../lib/player/AskmePlayerDecorator');
	

/**
 * Manager that:
 *    - searches series on nextorrent.net
 *    - filters results using a list of regular expressions
 *    - downloads the found items using Freebox
 *    - plays them using Freebox
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function NextorrentMoviesFreebox(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	var freeboxConf = JSON.parse(require('fs').readFileSync(directory+'tmp/freeboxApp.json', 'utf8'));
	Manager.apply(this, [
		new StepByStepManager(
			sarahContext,
			new SiteSearch(config.searchMoviesUrl(), config.searchItemSelector(), config.siteParser),
			new AndFilter(new UnreadFilter(new JsonStore(directory+'tmp/unread.json')), new AskFilter(sarahContext)),
			nameProviderFactory.moviesShortName(),		// short name: remove all useless information that is not understandable when earing it
			config.urlProvider(),
			/*new TwoStepsDownloader(*/new FreeboxDownloader(freeboxConf, new BestNameMatcher(function(download) { return download.name; }), conf.list),// directory+'tmp/torrents/'),
			new AskmePlayerDecorator(sarahContext, new FreeboxAirMedia(freeboxConf), '${getSpeakName()} est téléchargé. Veux-tu le regarder maintenant ?')
		),
		{
			nothing: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, 'Rien à télécharger'),
			downloadStarted: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, '${getSpeakName()} en cours de téléchargement'),
			downloaded: new NullNotifier()
		}
	]);
}

util.inherits(NextorrentMoviesFreebox, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
NextorrentMoviesFreebox.initialize = function(initCtx) {
	if (!fs.existsSync(initCtx.directory+'tmp/torrents')){
	    fs.mkdirSync(initCtx.directory+'tmp/torrents');
	}
	var appFile = initCtx.directory+'tmp/freeboxApp.json';
	FreeboxDownloader.initialize(initCtx, appFile);
	FreeboxDownloader.ee.once('done', function(appInfo) {
		if(appInfo) {
			FreeboxAirMedia.initialize(initCtx, appFile);
			FreeboxAirMedia.ee.once('done', NextorrentMoviesFreebox.ee.emit.bind(NextorrentMoviesFreebox.ee, 'done'));
		}
	});
}

NextorrentMoviesFreebox.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
NextorrentMoviesFreebox.detect = function(detectCtx) {
	new FreeboxDetector().detect().on('available', NextorrentMoviesFreebox.ee.emit.bind(NextorrentMoviesFreebox.ee, 'available'));
}


module.exports = NextorrentMoviesFreebox;
