var Item = require('../Item');

module.exports = {
	cpasbien: function($, item) {
		return new Item($("a", item).text().replace(/^.+>\s*/, ""), $("a", item).attr("href"));
	}
}