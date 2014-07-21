exports.run = function() {
	var params = process.env["MAGICDL_RESET"];
	if(params) {
		var parts = params.split(",");
		for(var i=0, l=parts.length ; i<l ; i++) {
			var scriptParts = parts[i].split("?");
			var script = scriptParts[0];
			var args = scriptParts.length>1 ? scriptParts[1].split("&").map(decodeURIComponent) : null;
			var module = require("../../"+script);
			module.run.apply(module, args);
		}
	}
}