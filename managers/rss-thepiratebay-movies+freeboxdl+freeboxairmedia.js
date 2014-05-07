var RssSearch = require('../lib/search/RssSearch'),
	AndFilter = require('../lib/filter/AndFilter'),
	AskFilter = require('../lib/filter/AskFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	CompoundNameProvider = require('../lib/nameProvider/CompoundNameProvider'),
	TrimNameProvider = require('../lib/nameProvider/TrimNameProvider'),
	RegexpNameProvider = require('../lib/nameProvider/RegexpNameProvider'),
	NullUrlProvider = require('../lib/urlProvider/NullUrlProvider'),
	FreeboxDownloader = require('../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../lib/player/FreeboxAirMedia'),
//	MockDownloader = require('../lib/downloader/MockDownloader'),
//	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/manager/StepByStepManager'),
	JsonStore = require('../lib/store/JsonStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util');
	

function RssCpasbienSeriesFreebox(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	var freeboxConf = JSON.parse(require('fs').readFileSync(directory+'tmp/freeboxApp.json', 'utf8'));
	Manager.apply(this, [
		sarahContext,
		new RssSearch("http://rss.thepiratebay.se/201"),
		new AndFilter(new UnreadFilter(new JsonStore(directory+'tmp/unread.json')), new AskFilter(sarahContext)),
		new CompoundNameProvider(new RegexpNameProvider(/(VOSTFR|FRENCH|HDTV|XVID|BRRip|x264|HDRIP|AC3|TiTAN| CAM |AAC-SeedPeer|DVDRIP|WEBRIP|\.avi|\.mkv|ACAB|720p).*$/gi, ""), new TrimNameProvider()),		// short name: remove all useless information that is not understandable when earing it
		new NullUrlProvider(/href="(.+permalien=[^"]+)"/, "http://www.cpasbien.me"),
//		new MockDownloader(),
//		new MockPlayer()
		new FreeboxDownloader(freeboxConf, new BestNameMatcher(function(download) { return download.name; }), conf.list),
		new FreeboxAirMedia(freeboxConf)
	]);
}

util.inherits(RssCpasbienSeriesFreebox, Manager);

RssCpasbienSeriesFreebox.initialize = function(initCtx) {
	FreeboxDownloader.initialize(initCtx, initCtx.directory+'tmp/freeboxApp.json');
	FreeboxDownloader.ee.on('done', function(appInfo) {
		if(appInfo) {
			FreeboxAirMedia.initialize(initCtx, appInfo);
		}
	});
}

module.exports = RssCpasbienSeriesFreebox;
