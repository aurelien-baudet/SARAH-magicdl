var ExecutableFinder = require("../lib/util/ExecutableFinder"),
	duration = require("../lib/util/duration"),
	similarity = require("../lib/util/similarity");



exports.testSimilarity = function(test) {
	test.ok(similarity.isSimilar("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP AC3 2014", "The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP AC3 2014"));
	test.ok(similarity.isSimilar("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP AC3 2014", "The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP x264 2014"));
	test.ok(!similarity.isSimilar("The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP AC3 2014", "Not Safe For Work FRENCH DVDRIP 2014"));
	test.done();
}

exports.testSimilarityFilter = function(test) {
	test.deepEqual(similarity.filter(strings).sort(), filtered);
	test.done();
}

exports.testDurationDays = function(test) {
	test.equal(duration.format(3*duration.DAY+11*duration.HOUR+36*duration.MINUTE), "3 jours");
	test.equal(duration.format(1*duration.DAY+11*duration.HOUR+36*duration.MINUTE), "1 jour");
	test.done();
}

exports.testDurationHoursAndMinutes = function(test) {
	test.equal(duration.format(11*duration.HOUR+36*duration.MINUTE), "11 heures 36 minutes");
	test.equal(duration.format(1*duration.HOUR+36*duration.MINUTE), "1 heure 36 minutes");
	test.equal(duration.format(1*duration.HOUR), "1 heure");
	test.equal(duration.format(36*duration.MINUTE), "36 minutes");
	test.equal(duration.format(12*duration.MINUTE), "12 minutes");
	test.equal(duration.format(1*duration.MINUTE), "1 minute");
	test.done();
}

exports.testDurationSeconds = function(test) {
	test.equal(duration.format(21*duration.SECOND), "21 secondes");
	test.equal(duration.format(duration.SECOND), "1 seconde");
	test.done();
}

exports.testExecutableFinderJava = function(test) {
	var finder = new ExecutableFinder("java", "-version", "C:/Program Files/Java");
	finder.find();
	finder.on('executable', function(executable) {
		test.equal(executable, "java", "java should be found");
		test.done();
	})
}

exports.testExecutableFinderJavaRegexp = function(test) {
	var finder = new ExecutableFinder("foo", "-version", "C:/Program Files/Java/*/bin/java.exe");
	finder.find();
	finder.on('executable', function(executable) {
		var paths = ["C:/Program Files/Java/jre7/bin/java.exe", "C:/Program Files/Java/jdk1.7.0_04/bin/java.exe"];
		test.ok(paths.indexOf(executable)!=-1, "java should be found in one of "+paths.join(", ")+" but was "+executable);
		test.done();
	})
}

exports.testExecutableFinderVLC = function(test) {
	var finder = new ExecutableFinder("vlc", "--version", "C:/Program Files/Vlc/vlc.exe", "C:/Program Files/VideoLAN/VLC/vlc.exe", "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe");
	finder.find();
	finder.on('executable', function(executable) {
		test.ok(executable, "C:/Program Files (x86)/VideoLAN/VLC/vlc.exe", "executable souhd be C:/Program Files (x86)/VideoLAN/VLC/vlc.exe");
		test.done();
	})
}


var strings = [
	"Walking with Dinosaurs (2013) DVDRip NL gesproken DRT",
	"Squatters.2014.DVDRip.XviD-EVO",
	"The.Phantom.Carriage1921.576p.Criterion.Bluray.AC3.x264-GCJM",
	"THE.OTHER.WOMAN.[NL.audio].R5.DVDRiP.XVID.ViTALiS",
	"X-Men.Days.of.Future.Past.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"The.Amazing.Spider-Man.2.2014.720p.BRRip.XviD.AC3-DEViSE",
	"Rob.the.Mob.2014.720p.BRRip.XviD.AC3-DEViSE",
	"Rio.2.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"Non-Stop.2014.720p.BRRip.Xvid.Ac3-LTRG",
	"Noah.2014.720p.BRRip.Xvid.Ac3-ANALOG",
	"Need.for.Speed.2014.720p.BRRip.Xvid.Ac3-ANALOG",
	"Godzilla.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"Draft.Day.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"300.Rise.of.an.Empire.2013.720p.BRRip.XviD.AC3-FLAWL3SS",
	"Transformers.Age.of.Extinction.2014.720p.BRRip.XviD.AC3-ReLeNTLe",
	"Transcendence.2014.720p.BRRip.XviD.AC3-DEViSE",
	"The.Other.Woman.2014.720p.BRRip.Xvid.AC3.SANTi",
	"Neighbors.2014.720p.BRRip.Xvid.AC3.LTRG",
	"Moms&#039;.Night.Out.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"Heaven.Is.For.Real.2014.720p.BRRip.Xvid.AC3.SANTi",
	"Fading.Gigolo.2014.720p.BRRip.Xvid.AC3.LTRG",
	"Edge.of.Tomorrow.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"Divergent.2014.720p.BRRip.Xvid.Ac3-LTRG",
	"Captain.America.The.Winter.Soldier.2014.720p.BRRip.XviD.AC3-DEVi",
	"Brick.Mansions.2014.720p.BRRip.XviD.AC3-ReLeNTLesS",
	"A.Haunted.House.2.2014.720p.BRRip.XviD.AC3-DEViSE",
	"Jack ryan. Operacion sombra (2014) [HDrip][Castellano]",
	"Ready to Die (2014) NL Subs x264 HE-AAC DVDRip-NLU002",
	"Separadas al Nacer (2012)[DVDRip][Castellano Ac3 2.0][Comedia]",
	"RoboCop (2014) BrRip 300MB 480p x264 Dual Audio [Hindi + English",
	"Jack Ryan Operacion Sombra (2013) [DVDRip][Castellano.AC3 5.1][S",
	"Hartsbegeertes 2013 DVDrip Afrikaans",
	"The Fox Lover 2013 DVDScr XviD AC3-SmY",
	"Gunday (2014) Hindi Movie 400MB BrRip 480P x264 with ESubs {Grea",
	"Silent witness 2013 DVDScr XviD AC3-SmY",
	"Ready 2 Die 2014 DVDRip XviD-2LOW",
	"Jack Ryan Shadow Recruit 2014 BRRip XviD AC3-SANTi",
	"RoboCop 2014 BluRay-Rip x264 AAC-SSN",
	"Extraction 2013 HDRip XviD-AQOS",
	"Captain America The Winter Soldier 2014 HDTS XviD-VAiN",
	"Butcher Boys 2012 BRRip x264 AC3-MiLLENiUM",
	"Bewakoofiyaan (2014) Hindi Movie 300MB BrRip 480P x264 with ESub",
	"Dhoom 3 - DVDRip - x264 -magtorrent-com",
	"Dhoom 3 (2013) Hindi Movie BrRip 415MB HQ 480p x264 AAC with ESu",
	"Al encuentro de Mr. Banks(2013)[DVDrip][Cast(Ac3 5.1)][Sub.Forz]",
	"The House Of Magic 2013 BDRip XviD MP3-RARBG",
	"The House Of Magic 2013 BDRip XviD AC3-RARBG",
	"The House Of Magic",
	"House Of Magic",
	"House Of Cards",
	"House Of Cards 2013 BDRip XviD MP3-RARBG",
	"X-Men.Days.Of.Future.Past.2014.720p.BRRip.Xvid.AC3.LTRG",
	"Under.The.Skin.2014.720p.BRRip.Xvid.AC3.MAJESTiC",
	"Transcendence.2014.720p.BRRip.Xvid.AC3.MAJESTiC",
	"The.Other.Woman.2014.720p.BRRip.Xvid.AC3.SANTi",
	"The Blues Brothers Movie (1980) Full DVD",
	"The.Lego.Movie.2013.720p.BRRip.Xvid.AC3.SANTi",
	"The.Grand.Budapest.Hotel.2014.720p.BRRip.Xvid.AC3.SPARKS",
	"The.Amazing.Spider.Man.2.2014.720p.BRRip.Xvid.AC3.SPARKS",
	"Rio.2.2014.720p.BRRip.Xvid.AC3.SANTi",
	"Non.Stop.2014.720p.BRRip.Xvid.AC3.SANTi",
	"Noah.2014.720p.BRRip.Xvid.AC3.DEViSE",
	"Neighbors.2014.720p.BRRip.Xvid.AC3.LTRG",
	"Need.For.Speed.2014.720p.BRRip.Xvid.AC3.DEViSE",
	"Tricked FRENCH DVDRIP 2014",
	"Jack Ryan: Shadow Recruit FRENCH DVDRIP 2014",
	"The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP 2014",
	"The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP AC3 2014",
	"The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH DVDRIP x264 2014",
	"The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH BluRay 1080p 2014",
	"The Ryan Initiative (Jack Ryan: Shadow Recruit) FRENCH BluRay 720p 2014",
	"Not Safe For Work FRENCH DVDRIP 2014",
	"L'Ordre des gardiens (The Hunters) FRENCH DVDRIP 2014",
	"That Awkward Moment FRENCH DVDRIP 2014",
	"That Awkward Moment FRENCH DVDRIP x264 2014",
	"That Awkward Moment FRENCH BluRay 1080p 2014",
	"That Awkward Moment FRENCH BluRay 720p 2014",
	"Awkward Moment FRENCH BluRay 720p 2014",
	"I, Frankenstein FRENCH DVDRIP 2014",
	"I, Frankenstein FRENCH DVDRIP AC3 2014",
	"I, Frankenstein FRENCH DVDRIP x264 2014",
	"I, Frankenstein FRENCH BluRay 1080p 2014",
	"I, Frankenstein FRENCH BluRay 720p 2014",
	"RoboCop FRENCH DVDRIP 2014",
	"RoboCop FRENCH DVDRIP AC3 2014",
	"RoboCop FRENCH DVDRIP x264 2014"
];
	

var filtered = [
	"Walking with Dinosaurs",
	"Squatters",
	"The Phantom Carriage1921",
	"THE OTHER WOMAN",
	"X Men Days of Future Past",
	"The Amazing Spider Man 2",
	"Rob the Mob",
	"Rio 2",
	"Godzilla",
	"Draft Day",
	"300 Rise of an Empire",
	"Transformers Age of Extinction",
	"Transcendence",
	"Neighbors",
	"Moms 039 Night Out",
	"Heaven Is For Real",
	"Fading Gigolo",
	"Edge of Tomorrow",
	"Divergent",
	"Brick Mansions",
	"A Haunted House 2",
	"Jack ryan Operacion sombra",
	"Ready to Die",
	"Separadas al Nacer",
	"RoboCop",
	"Hartsbegeertes",
	"The Fox Lover",
	"Gunday",
	"Silent witness",
	"Ready 2 Die",
	"Jack Ryan Shadow Recruit",
	"Extraction",
	"Captain America The Winter Soldier",
	"Butcher Boys",
	"Bewakoofiyaan",
	"Dhoom 3",
	"Al encuentro de Mr Banks",
	"The House Of Magic",
	"House Of Cards",
	"Under The Skin",
	"The Blues Brothers Movie 1980 Full",
	"The Lego Movie",
	"The Grand Budapest Hotel",
	"Non Stop",
	"Noah",
	"Need For Speed",
	"I Frankenstein",
//	"The Ryan Initiative Jack Ryan Shadow Recruit",
	"Not Safe For Work",
	"L'Ordre des gardiens The Hunters",
	"That Awkward Moment",
	"Tricked"
].map(function(str) {
	return str.toLowerCase();
}).sort();