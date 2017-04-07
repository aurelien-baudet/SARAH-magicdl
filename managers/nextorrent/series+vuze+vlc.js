var SiteSearch = require('../../lib/search/SiteSearch'),
	config = require('../../lib/config/nextorrent'),
	AndFilter = require('../../lib/filter/AndFilter'),
	RegexpListFilter = require('../../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../../lib/nameProvider/factory'),
	VuzeDownloader = require('../../lib/downloader/VuzeDownloader'),
	Vlc = require('../../lib/player/Vlc'),
	Manager = require('../../lib/manager/NotificationDecorator'),
	FullAsyncManager = require('../../lib/manager/FullAsyncManager'),
	JsonStore = require('../../lib/store/JsonStore'),
	BestNameMatcher = require('../../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	AndDetector = require('../../lib/capabilities/AndDetector'),
	JavaDetector = require('../../lib/capabilities/JavaDetector'),
	VlcDetector = require('../../lib/capabilities/VlcDetector'),
	NullNotifier = require('../../lib/notify/NullNotifier'),
	SpeakNotifier = require('../../lib/notify/SpeakNotifier'),
	PushingBoxNotifier = require('../../lib/notify/PushingBoxNotifier'),
	AskmePlayerDecorator = require('../../lib/player/AskmePlayerDecorator');
	

/**
 * Manager that:
 *    - searches series on nextorrent.net
 *    - filters results using a list of regular expressions
 *    - downloads the found items using Vuze
 *    - plays them using VLC
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function NextorrentSeriesVuzeVlc(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	Manager.apply(this, [
		new FullAsyncManager(
			sarahContext,
			new SiteSearch(config.searchSeriesUrl(), config.searchItemSelector(), config.siteParser),
			new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new JsonStore(directory+'tmp/unread.json'))),
			nameProviderFactory.seriesShortName(),
			config.urlProvider(),
			new VuzeDownloader(new BestNameMatcher(function(download) { return download.TORRENT[0].NAME[0]; })),
			new AskmePlayerDecorator(sarahContext, new Vlc(sarahContext), '${getSpeakName()} est téléchargé. Veux-tu le regarder maintenant ?')
		),
		{
			nothing: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, 'Rien à télécharger'),
			downloadStarted: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, '${getSpeakName()} en cours de téléchargement'),
			downloaded: new NullNotifier()
		}
	]);
}

util.inherits(NextorrentSeriesVuzeVlc, Manager);


/**
 * Called when SARAH initializes. Start Vuze in a background process
 * 
 * @param initCtx			the SARAH initialization context
 */
NextorrentSeriesVuzeVlc.initialize = function(initCtx) {
	VuzeDownloader.initialize(initCtx);
	VuzeDownloader.ee.once('done', NextorrentSeriesVuzeVlc.ee.emit.bind(NextorrentSeriesVuzeVlc.ee, 'done'));
}


NextorrentSeriesVuzeVlc.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
NextorrentSeriesVuzeVlc.detect = function(detectCtx) {
	new AndDetector(new JavaDetector(), new VlcDetector()).detect().on('available', NextorrentSeriesVuzeVlc.ee.emit.bind(NextorrentSeriesVuzeVlc.ee, 'available'));
}

module.exports = NextorrentSeriesVuzeVlc;