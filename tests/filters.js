var AndFilter = require("../lib/filter/AndFilter"),
	OrFilter = require("../lib/filter/OrFilter"),
	RegexpFilter = require("../lib/filter/RegexpFilter"),
	RegexpListFilter = require("../lib/filter/RegexpListFilter"),
	Item = require("../lib/Item");

var itemsList = [[
	new Item("[www.Cpasbien.me] Arrow.S02E21.FASTSUB.VOSTFR.HDTV.XviD-ATN.avi"),
	new Item("[www.Cpasbien.me] Arrow.S02E21.FASTSUB.FRENCH.HDTV.XviD-ATN.avi"),
	new Item("[www.Cpasbien.me] Arrow.S03E21.FASTSUB.FRENCH.HDTV.XviD-ATN.avi"),
	new Item("[www.Cpasbien.me] The.big.bang.theory.S07E23.FRENCH.HDTV.avi"),
	new Item("[www.Cpasbien.me] The.big.bang.theory.S07E22.VOSTFR.HDTV.avi"),
	new Item("S04E01 Game of thrones FR.mkv")
], [
	new Item("The Originals S01E21 VOSTFR HDTV"),
	new Item("Supernatural S09E21 VOSTFR HDTV"),
	new Item("[www.Cpasbien.me] Arrow.S03E21.FASTSUB.FRENCH.HDTV.XviD-ATN.avi"),
	new Item("Person of Interest S03E22 VOSTFR HDTV"),
	new Item("[www.Cpasbien.me] The.big.bang.theory.S07E22.VOSTFR.HDTV.avi"),
	new Item("Witches of East End S01E01 FRENCH HDTV")
]];

exports.testRegexpFilter = function(test) {
	var filters = [
		{filter: new RegexpFilter("arrow.*"), expected: [3, 1]},
		{filter: new RegexpFilter("game"), expected: [1, 0]}
	];
	suite(filters, test);
}


exports.testRegexpListFilter = function(test) {
	var filters = [
		{filter: new RegexpListFilter({regexp: "arrow.*VOSTFR"}, {regexp: "the.big.bang.theory.*VOSTFR"}), expected: [2, 1]},
		{filter: new RegexpListFilter({regexp: "arrow.*"}, {regexp: "the.big.bang.theory.*"}), expected: [5, 2]},
		{filter: new RegexpListFilter({regexp: "VOSTFR"}, {regexp: "FRENCH"}), expected: [5, 6]}
	];
	suite(filters, test);
}

exports.testAndRegexpFilter = function(test) {
	var filters = [
		{filter: new AndFilter(new RegexpFilter("arrow.*"), new RegexpFilter(".*VOSTFR.*")), expected: [1, 0]},
		{filter: new AndFilter(new RegexpFilter("arrow.*"), new RegexpFilter(".*FRENCH.*")), expected: [2, 1]},
		{filter: new AndFilter(new RegexpFilter("bang.*"), new RegexpFilter(".*HDTV.*")), expected: [2, 1]}
	];
	suite(filters, test);
}

exports.testOrRegexpFilter = function(test) {
	var filters = [
		{filter: new OrFilter(new RegexpFilter("arrow.*"), new RegexpFilter(".*VOSTFR.*")), expected: [4, 5]},
		{filter: new OrFilter(new RegexpFilter("arrow.*"), new RegexpFilter(".*FRENCH.*")), expected: [4, 2]},
		{filter: new OrFilter(new RegexpFilter("bang.*"), new RegexpFilter(".*HDTV.*")), expected: [5, 6]}
	];
	suite(filters, test);
}

function suite(filters, test) {
	test.expect(filters.length*itemsList.length*2);
	next(filters, 0, 0, test);
}

function next(filters, filterIdx, itemsIdx, test) {
	if(filterIdx<filters.length) {
		if(itemsIdx<itemsList.length) {
			testFilter(filters[filterIdx].filter, itemsList[itemsIdx], filters[filterIdx].expected[itemsIdx], test, function() {
				next(filters, filterIdx, itemsIdx+1, test);
			});
		} else {
			next(filters, filterIdx+1, 0, test);
		}
	} else {
		test.done();
	}
}

function testFilter(filter, items, numAccepted, test, cb) {
	for(var i=0 ; i<items.length ; i++) {
		filter.accept(items[i], i, items);
	}
	var accepted = [];
	var rejected = [];
	filter.on('accepted', function(item) {
		accepted.push(item);
	});
	filter.on('rejected', function(item) {
		rejected.push(item);
	});
	filter.on('done', function(item) {
		if(accepted.length+rejected.length>=items.length) {
			test.equal(accepted.length, numAccepted, filter+" should accept "+numAccepted+" items");
			test.equal(rejected.length, items.length-numAccepted, filter+" should reject "+(items.length-numAccepted)+" items");
			filter.removeAllListeners();
			cb();
		}
	});	
}