var fs = require('fs');

/**
 * Store that save the data into a JSON file.
 * 
 * @param path		the path to the file
 */
function JsonStore(/*String*/path) {
	this.path = path;
	if(!fs.existsSync(path)) {
		fs.writeFileSync(path, '{}');
	}
	this.clear();
}

/**
 * Add an entry into the store
 * 
 * @param key			the key of the entry
 * @param value			the value of the entry
 */
JsonStore.prototype.save = function(/*String*/key, /*any*/value) {
	this.map[key] = value;
	fs.writeFileSync(this.path, JSON.stringify(this.map));
}

/**
 * Return the value for the provided key or null if nothing was previously saved for this key
 * 
 * @param key		the key to get value for
 * @returns the found value or null if not found
 */
JsonStore.prototype.get = function(/*String*/key) {
	return this.map[key];
}

/**
 * Remove an entry from the store
 * 
 * @param key		the key of the entry to remove
 */
JsonStore.prototype.remove = function(/*String*/key) {
	delete this.map[key];
	fs.writeFileSync(this.path, JSON.stringify(this.map));
}

/**
 * Check if the key exists in the store
 * 
 * @param key			the key to search in the store
 * @returns true if exists, false otherwise
 */
JsonStore.prototype.exists = function(/*String*/key) {
	return !!this.map[key];
}

/**
 * Get the full map
 * 
 * @returns the full map
 */
JsonStore.prototype.getMap = function() {
	return this.map;
}

/**
 * Clear the store
 */
JsonStore.prototype.clear = function() {
	this.map = JSON.parse(fs.readFileSync(this.path, "utf-8") || "{}");
}

JsonStore.prototype.toString = function() {
	return "JsonStore["+this.path+"]";
}

module.exports = JsonStore;