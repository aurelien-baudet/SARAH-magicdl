function Item(name, url) {
	this.id = new Date().valueOf()+Math.random()+url;
	this.name = name;
	this.url = url;
	this.speakName = name;
	this.downloadUrl = url;
}

Item.prototype.getName = function() {
	return this.name;
}

Item.prototype.setName = function(name) {
	this.name = name;
}

Item.prototype.getSpeakName = function() {
	return this.speakName;
}

Item.prototype.setSpeakName = function(name) {
	this.speakName = name;
}

Item.prototype.getUrl = function() {
	return this.url;
}

Item.prototype.setUrl = function(url) {
	this.url = url;
}

Item.prototype.getDownloadUrl = function() {
	return this.downloadUrl;
}

Item.prototype.setDownloadUrl = function(url) {
	this.downloadUrl = url;
}

Item.prototype.getPlayUrl = function() {
	return this.playUrl;
}

Item.prototype.setPlayUrl = function(url) {
	this.playUrl = url;
}


Item.fromRawObject = function(/*Object*/obj) {
	var item = new Item();
	for(var i in obj) {
		item[i] = obj[i];
	}
	return item;
}

module.exports = Item;