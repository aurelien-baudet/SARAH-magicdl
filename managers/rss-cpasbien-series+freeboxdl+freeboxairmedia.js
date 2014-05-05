var RssSearch = require('../lib/search/RssSearch'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	RegexpNameProvider = require('../lib/nameProvider/RegexpNameProvider'),
	HtmlParserUrlProvider = require('../lib/urlProvider/HtmlParserUrlProvider'),
	FreeboxDownloader = require('../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../lib/player/FreeboxAirMedia'),
	Manager = require('../lib/Manager'),
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
		new RssSearch("http://www.cpasbien.me/flux_rss.php?mainid=series"),
		new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new JsonStore(directory+'tmp/unread.json'))),
		new RegexpNameProvider(/^(.+) S[0-9]+E[0-9]+.*$/),
		new HtmlParserUrlProvider(/href="(.+permalien=[^"]+)"/, "http://www.cpasbien.me"),
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
