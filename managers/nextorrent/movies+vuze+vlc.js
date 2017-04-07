var SiteSearch = require('../../lib/search/SiteSearch'),
	config = require('../../lib/config/nextorrent'),
	AndFilter = require('../../lib/filter/AndFilter'),
	AskFilter = require('../../lib/filter/AskFilter'),
	UnreadFilter = require('../../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../../lib/nameProvider/factory'),
	VuzeDownloader = require('../../lib/downloader/VuzeDownloader'),
	Vlc = require('../../lib/player/Vlc'),
	Manager = require('../../lib/manager/NotificationDecorator'),
	StepByStepManager = require('../../lib/manager/StepByStepManager'),
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
function NextorrentMoviesVuzeVlc(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	Manager.apply(this, [
		new StepByStepManager(
			sarahContext,
			new SiteSearch(config.searchSeriesUrl(), config.searchItemSelector(), config.siteParser),
			new AndFilter(new UnreadFilter(new JsonStore(directory+'tmp/unread.json')), new AskFilter(sarahContext)),
			nameProviderFactory.moviesShortName(),		// short name: remove all useless information that is not understandable when earing it
			config.urlProvider(),
			new AskmePlayerDecorator(sarahContext, new VuzeDownloader(new BestNameMatcher(function(download) { return download.TORRENT[0].NAME[0]; })), '${getSpeakName()} est téléchargé. Veux-tu le regarder maintenant ?'),
			new AskmePlayerDecorator(sarahContext, new Vlc(sarahContext), '${getSpeakName()} est téléchargé. Veux-tu le regarder maintenant ?')
		),
		{
			nothing: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, 'Rien à télécharger'),
			downloadStarted: sarahContext.config.silent ? new NullNotifier() : new SpeakNotifier(sarahContext, '${getSpeakName()} en cours de téléchargement'),
			downloaded: new NullNotifier()
		}
	]);
}

util.inherits(NextorrentMoviesVuzeVlc, Manager);


/**
 * Called when SARAH initializes. Start Vuze in a background process
 * 
 * @param initCtx			the SARAH initialization context
 */
NextorrentMoviesVuzeVlc.initialize = function(initCtx) {
	VuzeDownloader.initialize(initCtx);
	VuzeDownloader.ee.once('done', NextorrentMoviesVuzeVlc.ee.emit.bind(NextorrentMoviesVuzeVlc.ee, 'done'));
}


NextorrentMoviesVuzeVlc.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
NextorrentMoviesVuzeVlc.detect = function(detectCtx) {
	new AndDetector(new JavaDetector(), new VlcDetector()).detect().on('available', NextorrentMoviesVuzeVlc.ee.emit.bind(NextorrentMoviesVuzeVlc.ee, 'available'));
}

module.exports = NextorrentMoviesVuzeVlc;