var MemoryStore = require("../lib/store/MemoryStore"),
	WaitPresencePlayerDecorator = require("../lib/player/WaitPresencePlayerDecorator"),
	RandomDetector = require("../lib/presence/RandomDetector");

var fakeSarahContext = {
	SARAH: {
		askme: function(tts, grammar, timeout, cb) {
			cb("", function() {});
		}
	}
};

//exports.testWaitPresencePlayerDecorator = function(test) {
//	var store = new MemoryStore({"1405981441535.7869http://www.cpasbien.pe/dl-torrent/series/f-g-h/gang-related-s01e09-vostfr-hdtv.html":{"id":"1405981441535.7869http://www.cpasbien.pe/dl-torrent/series/f-g-h/gang-related-s01e09-vostfr-hdtv.html","name":"Gang Related S01E09 VOSTFR HDTV","url":"http://www.cpasbien.pe/dl-torrent/series/f-g-h/gang-related-s01e09-vostfr-hdtv.html","speakName":"gang related","downloadUrl":"http://www.cpasbien.pe/dl_torrent.php?permalien=gang-related-s01e09-vostfr-hdtv","freebox":{"downloadId":1077},"playUrl":"http://82.236.136.146:15372/share/8_faaPKcuzTUyR0j/%5Bwww.Cpasbien.pe%5D%20Gang.Related.S01E09.FASTSUB.VOSTFR.HDTV.XviD-ATN.avi"}});
//	var player = new WaitPresencePlayerDecorator(fakeSarahContext, null, new RandomDetector(), store);
//	player.ask();
//	test.done();
//}
