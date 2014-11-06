var RssSearch = require('../lib/search/RssSearch'),
	SiteSearch = require('../lib/search/SiteSearch')
	siteParserFactory = require('../lib/search/siteParserFactory'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	urlProviderFactory = require('../lib/urlProvider/urlProviderFactory'),
	VuzeDownloader = require('../lib/downloader/VuzeDownloader'),
	Vlc = require('../lib/player/Vlc'),
	Manager = require('../lib/manager/NotificationDecorator'),
	FullAsyncManager = require('../lib/manager/FullAsyncManager'),
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
 *    - searches series on www.cpasbien.me
 *    - filters results using a list of regular expressions
 *    - downloads the found items using Vuze
 *    - plays them using VLC
 *    
 *    
 * @param sarahContext				the SARAH execution context
 */
function RssCpasbienSeriesVlc(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	Manager.apply(this, [
		new FullAsyncManager(
			sarahContext,
//			new RssSearch("http://www.cpasbien.pe/flux_rss.php?mainid=series"),
			new SiteSearch("http://www.cpasbien.pe/derniers-torrents.php?filtre=series", ".torrent-aff", siteParserFactory.cpasbien),
			new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new JsonStore(directory+'tmp/unread.json'))),
			nameProviderFactory.seriesShortName(),
			urlProviderFactory.cpasbien(),
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

util.inherits(RssCpasbienSeriesVlc, Manager);


/**
 * Called when SARAH initializes. Start Vuze in a background process
 * 
 * @param initCtx			the SARAH initialization context
 */
RssCpasbienSeriesVlc.initialize = function(initCtx) {
	VuzeDownloader.initialize(initCtx);
	VuzeDownloader.ee.once('done', RssCpasbienSeriesVlc.ee.emit.bind(RssCpasbienSeriesVlc.ee, 'done'));
}


RssCpasbienSeriesVlc.ee = new EventEmitter();

/**
 * Execute feature availability detection
 * 
 * @param detectCtx				the SARAH context used for detection
 */
RssCpasbienSeriesVlc.detect = function(detectCtx) {
	new AndDetector(new JavaDetector(), new VlcDetector()).detect().on('available', RssCpasbienSeriesVlc.ee.emit.bind(RssCpasbienSeriesVlc.ee, 'available'));
}

module.exports = RssCpasbienSeriesVlc;