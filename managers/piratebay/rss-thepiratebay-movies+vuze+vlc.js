var RssSearch = require('../lib/search/RssSearch'),
	AndFilter = require('../lib/filter/AndFilter'),
	AskFilter = require('../lib/filter/AskFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	NullUrlProvider = require('../lib/urlProvider/NullUrlProvider'),
	VuzeDownloader = require('../lib/downloader/VuzeDownloader'),
	Vlc = require('../lib/player/Vlc'),
	Manager = require('../lib/manager/NotificationDecorator'),
	StepByStepManager = require('../lib/manager/StepByStepManager'),
	JsonStore = require('../lib/store/JsonStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	AndDetector = require('../lib/capabilities/AndDetector'),
	JavaDetector = require('../lib/capabilities/JavaDetector'),
	VlcDetector = require('../lib/capabilities/VlcDetector'),
	NullNotifier = require('../lib/notify/NullNotifier'),
	SpeakNotifier = require('../lib/notify/SpeakNotifier'),
	PushingBoxNotifier = require('../lib/notify/PushingBoxNotifier'),
	AskmePlayerDecorator = require('../lib/player/AskmePlayerDecorator');
	


/**
 * Manager that:
 *    - searches movies on www.thepiratebay.se
 *    - filters results by asking
 *    - downloads the found items using Freebox
 *    - plays them using Freebox
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function RssThepiratebayMoviesVuzeVlc(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	Manager.apply(this, [
		new StepByStepManager(
			sarahContext,
			new RssSearch("http://rss.thepiratebay.se/201"),
			new AndFilter(new UnreadFilter(new JsonStore(directory+'tmp/unread.json')), new AskFilter(sarahContext)),
			nameProviderFactory.moviesShortName(),		// short name: remove all useless information that is not understandable when earing it
			new NullUrlProvider(),
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

util.inherits(RssThepiratebayMoviesVuzeVlc, Manager);


/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
RssThepiratebayMoviesVuzeVlc.initialize = function(initCtx) {
	VuzeDownloader.initialize(initCtx);
	VuzeDownloader.ee.once('done', RssCpasbienSeriesFreebox.ee.emit.bind(RssCpasbienSeriesFreebox.ee, 'done'));
}



RssThepiratebayMoviesVuzeVlc.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
RssThepiratebayMoviesVuzeVlc.detect = function(detectCtx) {
	new AndDetector(new JavaDetector(), new VlcDetector()).detect().on('available', RssThepiratebayMoviesVuzeVlc.ee.emit.bind(RssThepiratebayMoviesVuzeVlc.ee, 'available'));
}


module.exports = RssThepiratebayMoviesVuzeVlc;
