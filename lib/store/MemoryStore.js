/**
 * Simple store that keep information into the memory
 */
function MemoryStore(/*Map?*/map) {
	this.map = map ? map : {};
}

/**
 * Add an entry into the store
 * 
 * @param key			the key of the entry
 * @param value			the value of the entry
 */
MemoryStore.prototype.save = function(/*String*/key, /*any*/value) {
	this.map[key] = value;
}

/**
 * Return the value for the provided key or null if nothing was previously saved for this key
 * 
 * @param key		the key to get value for
 * @returns the found value or null if not found
 */
MemoryStore.prototype.get = function(/*String*/key) {
	return this.map[key];
}

/**
 * Remove an entry from the store
 * 
 * @param key		the key of the entry to remove
 */
MemoryStore.prototype.remove = function(/*String*/key) {
	delete this.map[key];
}

/**
 * Check if the key exists in the store
 * 
 * @param key			the key to search in the store
 * @returns true if exists, false otherwise
 */
MemoryStore.prototype.exists = function(/*String*/key) {
	return !!this.map[key];
}

/**
 * Get the full map
 * 
 * @returns the full map
 */
MemoryStore.prototype.getMap = function() {
	return this.map;
}

/**
 * Clear the store
 */
MemoryStore.prototype.clear = function() {
	this.map = {};
}

module.exports = MemoryStore;