module.exports = {
	substitute: function(/*String*/str, /*Object*/obj) {
		return str.replace(/\$\{([^}]+)\}/g, function(_, match) {
			return eval('obj.'+match);
		});
	}
}