var RssSearch = require('../lib/search/RssSearch'),
	AndFilter = require('../lib/filter/AndFilter'),
	RegexpListFilter = require('../lib/filter/RegexpListFilter'),
	UnreadFilter = require('../lib/filter/UnreadFilter'),
	CompoundNameProvider = require('../lib/nameProvider/CompoundNameProvider'),
	TrimNameProvider = require('../lib/nameProvider/TrimNameProvider'),
	RegexpNameProvider = require('../lib/nameProvider/RegexpNameProvider'),
	HtmlRegexpUrlProvider = require('../lib/urlProvider/HtmlRegexpUrlProvider'),
	VuzeDownloader = require('../lib/downloader/VuzeDownloader'),
	Vlc = require('../lib/player/Vlc'),
	Manager = require('../lib/manager/FullAsyncManager'),
	JsonStore = require('../lib/store/JsonStore'),
	BestNameMatcher = require('../lib/matcher/BestNameMatcher'),
	fs = require('fs'),
	util = require('util');
	

function RssCpasbienSeriesVlc(sarahContext) {
	var directory = sarahContext.directory;
	// TODO: path should be configurable
	var conf = sarahContext.managerConf;
	Manager.apply(this, [
		sarahContext,
		new RssSearch("http://www.cpasbien.me/flux_rss.php?mainid=series"),
		new AndFilter(new RegexpListFilter(conf.list), new UnreadFilter(new JsonStore(directory+'tmp/unread.json'))),
		new CompoundNameProvider(new RegexpNameProvider(/^(.+) S[0-9]+E[0-9]+.*$/), new TrimNameProvider()),
		new HtmlRegexpUrlProvider(/href="(.+permalien=[^"]+)"/, "http://www.cpasbien.me"),
		new VuzeDownloader(sarahContext, new BestNameMatcher(function(download) { return download.TORRENT[0].NAME[0]; })),
		new Vlc(sarahContext)
	]);
}

util.inherits(RssCpasbienSeriesVlc, Manager);

RssCpasbienSeriesVlc.initialize = function(initCtx) {
	VuzeDownloader.initialize(initCtx);
}

module.exports = RssCpasbienSeriesVlc;