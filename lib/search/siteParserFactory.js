var Item = require('../Item');

module.exports = {
	cpasbien: {
		itemParser: function($, item) {
			return new Item($("a", item).text().replace(/^.+>\s*/, ""), $("a", item).attr("href"));
		},
		
		itemSelector: 'div[class^="ligne"] a'
	}
	
}