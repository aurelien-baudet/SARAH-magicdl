var RssSearch = require('../lib/search/RssSearch'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	CompoundNameProvider = require('../lib/nameProvider/CompoundNameProvider'),
	TrimNameProvider = require('../lib/nameProvider/TrimNameProvider'),
	RegexpNameProvider = require('../lib/nameProvider/RegexpNameProvider'),
	HtmlRegexpUrlProvider = require('../lib/urlProvider/HtmlRegexpUrlProvider'),
	FreeboxDownloader = require('../lib/downloader/FreeboxDownloader'),
	FreeboxAirMedia = require('../lib/player/FreeboxAirMedia'),
	Manager = require('../lib/manager/FullAsyncManager'),
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
		new CompoundNameProvider(new RegexpNameProvider(/S0?([0-9]+)E([0-9]+)/, ""), new RegexpNameProvider(/VOSTFR/, ""), new RegexpNameProvider(/FRENCH/, ""), new RegexpNameProvider(/HDTV/, ""), new TrimNameProvider()),		// short name
//		new CompoundNameProvider(new RegexpNameProvider(/S0?([0-9]+)E0?([0-9]+)/, "saison $1 épisode $2"), new RegexpNameProvider(/VOSTFR/, "version originale sous titrée"), new RegexpNameProvider(/FRENCH/, "version française"), new RegexpNameProvider(/HDTV/, ""), new TrimNameProvider()),		// long name
		new HtmlRegexpUrlProvider(/href="(.+permalien=[^"]+)"/, "http://www.cpasbien.me"),
		new FreeboxDownloader(freeboxConf, new BestNameMatcher(function(download) { return download.name; }), conf.list),
		new FreeboxAirMedia(freeboxConf)
	]);
}

util.inherits(RssCpasbienSeriesFreebox, Manager);

RssCpasbienSeriesFreebox.initialize = function(initCtx) {
	var appFile = initCtx.directory+'tmp/freeboxApp.json';
	FreeboxDownloader.initialize(initCtx, appFile);
	FreeboxDownloader.ee.on('done', function(appInfo) {
		if(appInfo) {
			FreeboxAirMedia.initialize(initCtx, appFile);
		}
	});
}

module.exports = RssCpasbienSeriesFreebox;
