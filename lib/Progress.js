function Progress(/*Item*/item, /*Integer*/percent, /*Integer*/remainingTime) {
	this.item = item;
	this.percent = percent;
	this.remainingTime = remainingTime;
}

Progress.prototype.getItem = function() {
	return this.item;
}

Progress.prototype.getPercent = function() {
	return this.percent;
}

Progress.prototype.getRemainingTime = function() {
	return this.remainingTime;
}

module.exports = Progress;