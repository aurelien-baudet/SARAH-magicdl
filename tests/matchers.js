var BestNameMatcher = require("../lib/matcher/BestNameMatcher"),
	Item = require("../lib/Item");

exports.testBestNameMatcher = function(test) {
	var matcher = new BestNameMatcher(function(obj) { return obj.name; });
	var downloads = [
		{name: "[www.Cpasbien.me] Arrow.S02E21.FASTSUB.VOSTFR.HDTV.XviD-ATN.avi"},
		{name: "[www.Cpasbien.me] Arrow.S02E21.FASTSUB.FRENCH.HDTV.XviD-ATN.avi"},
		{name: "[www.Cpasbien.me] Arrow.S03E21.FASTSUB.FRENCH.HDTV.XviD-ATN.avi"},
		{name: "[www.Cpasbien.me] The.big.bang.theory.S07E23.FRENCH.HDTV.avi"},
		{name: "[www.Cpasbien.me] The.big.bang.theory.S07E22.VOSTFR.HDTV.avi"},
		{name: "S04E01 Game of thrones FR.mkv"}
	];
	var bestItem = matcher.match(createItem("Arrow S02E21 VOSTFR HDTV", "arrow"), downloads);
	test.equal(bestItem, downloads[0], "should be "+downloads[0]+" of "+bestItem);
	bestItem = matcher.match(createItem("Arrow S03E21 FRENCH HDTV", "arrow"), downloads);
	test.equal(bestItem, downloads[2], "should be "+downloads[2]+" of "+bestItem);
	bestItem = matcher.match(createItem("The big bang theory VOSTFR S07E22", "the big bang theory"), downloads);
	test.equal(bestItem, downloads[4], "should be "+downloads[4]+" of "+bestItem);
	bestItem = matcher.match(createItem("Not in list", "not in list vost fr"), downloads);
	test.equal(bestItem, null, "should not be found");
	test.done();
}


function createItem(name, speakName) {
	var item = new Item(name);
	item.setSpeakName(speakName);
	return item;
}

