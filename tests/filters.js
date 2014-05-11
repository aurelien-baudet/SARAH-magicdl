var AndFilter = require("../lib/filter/AndFilter"),
	OrFilter = require("../lib/filter/OrFilter"),
	RegexpFilter = require("../lib/filter/RegexpFilter"),
	RegexpListFilter = require("../lib/filter/RegexpListFilter"),
	AskFilter = require("../lib/filter/AskFilter"),
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

exports.testAskFilter = function(test) {
	// fake SARAH to simulate askme
	var sarahContext = {
		SARAH: {
			askme: function(text, grammar, timeout, next) {
				setTimeout(next.bind(this, "o", function() {}), 0);
			}
		}
	};
	testFilter(new AskFilter(sarahContext), movies, 51, test, test.done.bind(test));
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



var movies = [
	new Item("Walking with Dinosaurs (2013) DVDRip NL gesproken DRT"),
	new Item("Squatters.2014.DVDRip.XviD-EVO"),
	new Item("The.Phantom.Carriage1921.576p.Criterion.Bluray.AC3.x264-GCJM"),
	new Item("THE.OTHER.WOMAN.[NL.audio].R5.DVDRiP.XVID.ViTALiS"),
	new Item("X-Men.Days.of.Future.Past.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("The.Amazing.Spider-Man.2.2014.720p.BRRip.XviD.AC3-DEViSE"),
	new Item("Rob.the.Mob.2014.720p.BRRip.XviD.AC3-DEViSE"),
	new Item("Rio.2.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("Non-Stop.2014.720p.BRRip.Xvid.Ac3-LTRG"),
	new Item("Noah.2014.720p.BRRip.Xvid.Ac3-ANALOG"),
	new Item("Need.for.Speed.2014.720p.BRRip.Xvid.Ac3-ANALOG"),
	new Item("Godzilla.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("Draft.Day.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("300.Rise.of.an.Empire.2013.720p.BRRip.XviD.AC3-FLAWL3SS"),
	new Item("Transformers.Age.of.Extinction.2014.720p.BRRip.XviD.AC3-ReLeNTLe"),
	new Item("Transcendence.2014.720p.BRRip.XviD.AC3-DEViSE"),
	new Item("The.Other.Woman.2014.720p.BRRip.Xvid.AC3.SANTi"),
	new Item("Neighbors.2014.720p.BRRip.Xvid.AC3.LTRG"),
	new Item("Moms&#039;.Night.Out.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("Heaven.Is.For.Real.2014.720p.BRRip.Xvid.AC3.SANTi"),
	new Item("Fading.Gigolo.2014.720p.BRRip.Xvid.AC3.LTRG"),
	new Item("Edge.of.Tomorrow.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("Divergent.2014.720p.BRRip.Xvid.Ac3-LTRG"),
	new Item("Captain.America.The.Winter.Soldier.2014.720p.BRRip.XviD.AC3-DEVi"),
	new Item("Brick.Mansions.2014.720p.BRRip.XviD.AC3-ReLeNTLesS"),
	new Item("A.Haunted.House.2.2014.720p.BRRip.XviD.AC3-DEViSE"),
	new Item("Jack ryan. Operacion sombra (2014) [HDrip][Castellano]"),
	new Item("Ready to Die (2014) NL Subs x264 HE-AAC DVDRip-NLU002"),
	new Item("Separadas al Nacer (2012)[DVDRip][Castellano Ac3 2.0][Comedia]"),
	new Item("RoboCop (2014) BrRip 300MB 480p x264 Dual Audio [Hindi + English"),
	new Item("Jack Ryan Operacion Sombra (2013) [DVDRip][Castellano.AC3 5.1][S"),
	new Item("Hartsbegeertes 2013 DVDrip Afrikaans"),
	new Item("The Fox Lover 2013 DVDScr XviD AC3-SmY"),
	new Item("Gunday (2014) Hindi Movie 400MB BrRip 480P x264 with ESubs {Grea"),
	new Item("Silent witness 2013 DVDScr XviD AC3-SmY"),
	new Item("Ready 2 Die 2014 DVDRip XviD-2LOW"),
	new Item("Jack Ryan Shadow Recruit 2014 BRRip XviD AC3-SANTi"),
	new Item("RoboCop 2014 BluRay-Rip x264 AAC-SSN"),
	new Item("Extraction 2013 HDRip XviD-AQOS"),
	new Item("Captain America The Winter Soldier 2014 HDTS XviD-VAiN"),
	new Item("Butcher Boys 2012 BRRip x264 AC3-MiLLENiUM"),
	new Item("Bewakoofiyaan (2014) Hindi Movie 300MB BrRip 480P x264 with ESub"),
	new Item("Dhoom 3 - DVDRip - x264 -magtorrent-com"),
	new Item("Dhoom 3 (2013) Hindi Movie BrRip 415MB HQ 480p x264 AAC with ESu"),
	new Item("Al encuentro de Mr. Banks(2013)[DVDrip][Cast(Ac3 5.1)][Sub.Forz]"),
	new Item("The House Of Magic 2013 BDRip XviD MP3-RARBG"),
	new Item("The House Of Magic 2013 BDRip XviD AC3-RARBG"),
	new Item("The House Of Magic"),
	new Item("House Of Magic"),
	new Item("House Of Cards"),
	new Item("House Of Cards 2013 BDRip XviD MP3-RARBG"),
	new Item("X-Men.Days.Of.Future.Past.2014.720p.BRRip.Xvid.AC3.LTRG"),
	new Item("Under.The.Skin.2014.720p.BRRip.Xvid.AC3.MAJESTiC"),
	new Item("Transcendence.2014.720p.BRRip.Xvid.AC3.MAJESTiC"),
	new Item("The.Other.Woman.2014.720p.BRRip.Xvid.AC3.SANTi"),
	new Item("The Blues Brothers Movie (1980) Full DVD"),
	new Item("The.Lego.Movie.2013.720p.BRRip.Xvid.AC3.SANTi"),
	new Item("The.Grand.Budapest.Hotel.2014.720p.BRRip.Xvid.AC3.SPARKS"),
	new Item("The.Amazing.Spider.Man.2.2014.720p.BRRip.Xvid.AC3.SPARKS"),
	new Item("Rio.2.2014.720p.BRRip.Xvid.AC3.SANTi"),
	new Item("Non.Stop.2014.720p.BRRip.Xvid.AC3.SANTi"),
	new Item("Noah.2014.720p.BRRip.Xvid.AC3.DEViSE"),
	new Item("Neighbors.2014.720p.BRRip.Xvid.AC3.LTRG"),
	new Item("Need.For.Speed.2014.720p.BRRip.Xvid.AC3.DEViSE"),
	new Item("Tricked FRENCH DVDRIP 2014"),
	new Item("Jack Ryan: Shadow Recruit FRENCH DVDRIP 2014"),
	new Item("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP 2014"),
	new Item("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP AC3 2014"),
	new Item("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP x264 2014"),
	new Item("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH BluRay 1080p 2014"),
	new Item("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH BluRay 720p 2014"),
	new Item("Not Safe For Work FRENCH DVDRIP 2014"),
	new Item("L'Ordre des gardiens (The Hunters) FRENCH DVDRIP 2014"),
	new Item("That Awkward Moment FRENCH DVDRIP 2014"),
	new Item("That Awkward Moment FRENCH DVDRIP x264 2014"),
	new Item("That Awkward Moment FRENCH BluRay 1080p 2014"),
	new Item("That Awkward Moment FRENCH BluRay 720p 2014"),
	new Item("Awkward Moment FRENCH BluRay 720p 2014"),
	new Item("I, Frankenstein FRENCH DVDRIP 2014"),
	new Item("I, Frankenstein FRENCH DVDRIP AC3 2014"),
	new Item("I, Frankenstein FRENCH DVDRIP x264 2014"),
	new Item("I, Frankenstein FRENCH BluRay 1080p 2014"),
	new Item("I, Frankenstein FRENCH BluRay 720p 2014"),
	new Item("RoboCop FRENCH DVDRIP 2014"),
	new Item("RoboCop FRENCH DVDRIP AC3 2014"),
	new Item("RoboCop FRENCH DVDRIP x264 2014")
];
   	
