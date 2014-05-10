var moment = require('moment');

var SECOND = 1000;
var MINUTE = 60*SECOND;
var HOUR = 60*MINUTE;
var DAY = 24*HOUR;


var pluralize = function(value, str) {
	return str+(value>1 ? "s" : "");
}

var stringify = function(value, type) {
	return value+" "+pluralize(value, type);
}

module.exports = {
	SECOND: SECOND,
	MINUTE: MINUTE,
	HOUR: HOUR,
	DAY: DAY,
	
	format: function(duration) {
		var str = "";
		if(duration>=DAY) {
			return stringify(Math.floor(duration/DAY), "jour");
		}
		if(duration>=HOUR) {
			str += stringify(Math.floor(duration/HOUR), "heure");
			duration %= HOUR;
		}
		if(duration>=MINUTE) {
			str += (str.length ? " " : "") + stringify(Math.floor(duration/MINUTE), "minute");
			return str;
		}
		return str.length ? str : stringify(Math.floor(duration/SECOND), "seconde");
	}
}