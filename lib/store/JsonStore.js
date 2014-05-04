var fs = require('fs');

function JsonStore(path) {
	this.path = path;
	this.map = JSON.parse(fs.readFileSync(path, "utf-8") || "{}");
}

JsonStore.prototype.save = function(key, value) {
	this.map[key] = value;
	fs.writeFileSync(this.path, JSON.stringify(this.map));
}

JsonStore.prototype.get = function(key) {
	return this.map[key];
}

JsonStore.prototype.exists = function(key) {
	return !!this.map[key];
}

JsonStore.prototype.toString = function() {
	return "JsonStore["+this.path+"]";
}

module.exports = JsonStore;