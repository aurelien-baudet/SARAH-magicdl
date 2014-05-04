function MemoryStore() {
	this.map = {};
}

MemoryStore.prototype.save = function(key, value) {
	map[key] = value;
}

MemoryStore.prototype.get = function(key) {
	return map[key];
}

MemoryStore.prototype.exists = function(key) {
	return !!map[key];
}

module.exports = MemoryStore;