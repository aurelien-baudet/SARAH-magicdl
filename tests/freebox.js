var freebox = require("../lib/freebox"),
	fs = require("fs"),
	app = JSON.parse(fs.readFileSync(__dirname+"/../tmp/freeboxApp.json"));



//exports.testFsLs = function(test) {
//freebox.connect(app);
//freebox.on('ready', function() {
//	freebox.fs.ls(freebox.encodePath("/Disque dur/Séries/Gang Related/[www.Cpasbien.pe] Gang.Related.S01E09.FASTSUB.VOSTFR.HDTV.XviD-ATN"), function(files) {
//			test.done();
//	});
//});
//}

//exports.testFsLs2 = function(test) {
//	freebox.connect(app);
//	freebox.on('ready', function() {
//		freebox.fs.ls(freebox.encodePath("/Disque dur/Séries/Gang Related/[www.Cpasbien.pe] Gang.Related.S01E09.FASTSUB.VOSTFR.HDTV.XviD-ATN/[www.Cpasbien.pe] Gang.Related.S01E09.FASTSUB.VOSTFR.HDTV.XviD-ATN.avi"), function(files) {
//				test.done();
//		});
//	});
//}

//exports.testFsInfo = function(test) {
//	freebox.connect(app);
//	freebox.on('ready', function() {
//		freebox.fs.info(freebox.encodePath("/Disque dur/Séries/Gang Related/[www.Cpasbien.pe] Gang.Related.S01E09.FASTSUB.VOSTFR.HDTV.XviD-ATN"), function(files) {
//				test.done();
//		});
//	});
//}
//
//exports.testFsInfo2 = function(test) {
//	freebox.connect(app);
//	freebox.on('ready', function() {
//		freebox.fs.info(freebox.encodePath("/Disque dur/Séries/Gang Related/[www.Cpasbien.pe] Gang.Related.S01E09.FASTSUB.VOSTFR.HDTV.XviD-ATN/"), function(files) {
//				test.done();
//		});
//	});
//}

//exports.testFsInfo3 = function(test) {
//	freebox.connect(app);
//	freebox.on('ready', function() {
//		freebox.fs.info(freebox.encodePath("/"), function(files) {
//				test.done();
//		});
//	});
//}

//exports.testFsLs4 = function(test) {
//	freebox.connect(app);
//	freebox.on('ready', function() {
//		freebox.fs.ls(freebox.encodePath("/Disque dur/Séries/Gang Related//Gang.Related.S01E11.FASTSUB.VOSTFR.HDTV.XviD-ADDiCTiON.avi"), function(files) {
//				test.done();
//		});
//	});
//}
//
