/**
 * Simple store that keep information into the memory
 */
function MemoryStore() {
	this.map = {};
}

/**
 * Add an entry into the store
 * 
 * @param key			the key of the entry
 * @param value			the value of the entry
 */
MemoryStore.prototype.save = function(/*String*/key, /*any*/value) {
	map[key] = value;
}

/**
 * Return the value for the provided key or null if nothing was previously saved for this key
 * 
 * @param key		the key to get value for
 * @returns the found value or null if not found
 */
MemoryStore.prototype.get = function(/*String*/key) {
	return map[key];
}

/**
 * Check if the key exists in the store
 * 
 * @param key			the key to search in the store
 * @returns true if exists, false otherwise
 */
MemoryStore.prototype.exists = function(/*String*/key) {
	return !!map[key];
}

module.exports = MemoryStore;