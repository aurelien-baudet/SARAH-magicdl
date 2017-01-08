var SiteSearch = require('../lib/search/SiteSearch'),
	config = require('../lib/config/torrent9'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	TwoStepsDownloader = require('../lib/downloader/TwoStepsDownloader'),
	FreeboxDownloader = require('../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../lib/player/FreeboxAirMedia'),
	WaitPresencePlayerDecorator = require('../lib/player/WaitPresencePlayerDecorator'),
	RandomDetector = require('../lib/presence/RandomDetector'),
	KinectDetector = require('../lib/presence/KinectDetector'),
	Manager = require('../lib/manager/NotificationDecorator'),
	FullAsyncManager = require('../lib/manager/FullAsyncManager'),
	JsonStore = require('../lib/store/JsonStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	FreeboxDetector = require('../lib/capabilities/FreeboxDetector'),
	NullNotifier = require('../lib/notify/NullNotifier'),
	SpeakNotifier = require('../lib/notify/SpeakNotifier'),
	PushingBoxNotifier = require('../lib/notify/PushingBoxNotifier');
	

/**
 * Manager that:
 *    - searches series on www.torrent9.biz
 *    - filters results using a list of regular expressions
 *    - downloads the found items using Freebox
 *    - plays them using Freebox
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function Torrent9SeriesFreeboxPushingBox(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	var freeboxConf = JSON.parse(require('fs').readFileSync(directory+'tmp/freeboxApp.json', 'utf8'));
	Manager.apply(this, [
		new FullAsyncManager(
			sarahContext,
			new SiteSearch(config.searchSeriesUrl(), config.searchItemSelector(), config.siteParser),
			new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new JsonStore(directory+'tmp/unread.json'))),
			nameProviderFactory.seriesShortName(),
			config.urlProvider(),
			new TwoStepsDownloader(new FreeboxDownloader(freeboxConf, new BestNameMatcher(function(download) { return download.name; }), conf.list), directory+'tmp/torrents/'),
			new WaitPresencePlayerDecorator(sarahContext, new FreeboxAirMedia(freeboxConf), new KinectDetector(sarahContext), new JsonStore(directory+'tmp/waiting.json'))
//			new WaitPresencePlayerDecorator(sarahContext, new FreeboxAirMedia(freeboxConf), new RandomDetector(5000, 10000), new JsonStore(directory+'tmp/waiting.json')),
		),
		{
			nothing: new NullNotifier(),
			downloadStarted: new PushingBoxNotifier(sarahContext.config.pushingbox.deviceid, 'S.A.R.A.H. : ${getSpeakName()} en cours de téléchargement', '${getName()} en cours de téléchargement'),
			downloaded: new PushingBoxNotifier(sarahContext.config.pushingbox.deviceid, 'S.A.R.A.H. : ${getSpeakName()} est téléchargé', '${getName()} est téléchargé')
		}
	]);
}

util.inherits(Torrent9SeriesFreeboxPushingBox, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
Torrent9SeriesFreeboxPushingBox.initialize = function(initCtx) {
	if (!fs.existsSync(initCtx.directory+'tmp/torrents')){
	    fs.mkdirSync(initCtx.directory+'tmp/torrents');
	}
	var appFile = initCtx.directory+'tmp/freeboxApp.json';
	FreeboxDownloader.initialize(initCtx, appFile);
	FreeboxDownloader.ee.once('done', function(appInfo) {
		if(appInfo) {
			FreeboxAirMedia.initialize(initCtx, appFile);
			FreeboxAirMedia.ee.once('done', Torrent9SeriesFreeboxPushingBox.ee.emit.bind(Torrent9SeriesFreeboxPushingBox.ee, 'done'));
		}
	});
}

Torrent9SeriesFreeboxPushingBox.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
Torrent9SeriesFreeboxPushingBox.detect = function(detectCtx) {
	new FreeboxDetector().detect().on('available', Torrent9SeriesFreeboxPushingBox.ee.emit.bind(Torrent9SeriesFreeboxPushingBox.ee, 'available'));
}


module.exports = Torrent9SeriesFreeboxPushingBox;
