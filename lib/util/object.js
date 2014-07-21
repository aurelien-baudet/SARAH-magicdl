get = function(src, key) {
	var parts = key.split(".");
	var obj = src;
	for(var i=0, l=parts.length ; i<l ; i++) {
		var k = parts[i];
		obj = obj[k];
		if(typeof obj=="undefined") {
			break;
		}
	}
	return obj;
};


module.exports.get = get;