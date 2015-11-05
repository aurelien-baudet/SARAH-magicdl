var RssSearch = require('../lib/search/RssSearch'),
	SiteSearch = require('../lib/search/SiteSearch')
	config = require('../lib/config/cpasbien'),
	AndFilter = require('../lib/filter/AndFilter'),
	AskFilter = require('../lib/filter/AskFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	nameProviderFactory = require('../lib/nameProvider/factory'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/manager/NotificationDecorator'),
	StepByStepManager = require('../lib/manager/StepByStepManager'),
	MemoryStore = require('../lib/store/MemoryStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter,
	EnvironmentVariableDetector = require('../lib/capabilities/EnvironmentVariableDetector'),
	NullNotifier = require('../lib/notify/NullNotifier'),
	SpeakNotifier = require('../lib/notify/SpeakNotifier'),
	PushingBoxNotifier = require('../lib/notify/PushingBoxNotifier');
	

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
		new StepByStepManager(
			sarahContext,
//			new RssSearch("http://www.cpasbien.pe/flux_rss.php?mainid=films"),
			new SiteSearch(config.searchMoviesUrl(), config.searchItemSelector(), config.siteParser),
			new AndFilter(new UnreadFilter(new MemoryStore()), new AskFilter(sarahContext)),
			nameProviderFactory.moviesShortName(),		// short name: remove all useless information that is not understandable when earing it
			config.urlProvider(),
			new MockDownloader(),
			new MockPlayer()
		),
		{
			nothing: new SpeakNotifier(sarahContext, 'Rien à télécharger'),
			downloadStarted: new SpeakNotifier(sarahContext, '${getSpeakName()} en cours de téléchargement'),
			downloaded: new SpeakNotifier(sarahContext, '${getSpeakName()} est téléchargé')
		}
	]);
}

util.inherits(MoviesDevMode, Manager);

/**
 * Called when SARAH initializes. Initialize the Freebox application for being able to drive it.
 * 
 * @param initCtx			the SARAH initialization context
 */
MoviesDevMode.initialize = function(initCtx) {
	setTimeout(MoviesDevMode.ee.emit.bind(MoviesDevMode.ee, 'done'), 0);
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
