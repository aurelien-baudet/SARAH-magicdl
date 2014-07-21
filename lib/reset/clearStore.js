var fs = require("fs"),
	winston = require('winston');

exports.run = function(/*String...*/stores) {
	for(var i=0, l=arguments.length ; i<l ; i++) {
		var store = __dirname+"/../../"+arguments[i];
		try {
			fs.writeFileSync(store, '{}');
		} catch(e) {
			winston.log("error", "failed to clear store "+store+". Cause: "+e);
		}
	}
}