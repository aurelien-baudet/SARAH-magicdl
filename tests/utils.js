var ExecutableFinder = require("../lib/util/ExecutableFinder");

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

