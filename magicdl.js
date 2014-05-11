var fs = require('fs'),
	winston = require('winston'),
	instances = {};


winston.level = "debug";

exports.init = function(SARAH) {
	var directory = './plugins/magicdl/';
	var conf = JSON.parse(require('fs').readFileSync(directory+'download.json', 'utf8'));
	for(var action in conf) {
		var manager = conf[action].manager || "AutoDetectManager";
		var Manager = require('./managers/'+manager);
		Manager.initialize({
			SARAH: SARAH,
			directory: directory,
			downloadConf: conf,
			managerConf: conf[action],
			action: action
		});
	}
}

	
exports.action = function (data, callback, config, SARAH) {
    config = config.modules.magicdl;
	var directory = data.directory + '/../plugins/magicdl/';
	var conf = JSON.parse(require('fs').readFileSync(directory+'download.json', 'utf8'));
	var manager = conf[data.command].manager || "AutoDetectManager";
	winston.log("debug", "executing "+manager+" for command "+data.command+" and method "+data.method);
	var Manager = require('./managers/'+manager);
	if(Manager) {
		var instance = instances[data.command];
		if(!instance) {
			instance = instances[data.command] = new Manager({
				data: data,
				callback: callback,
				config: config,
				SARAH: SARAH,
				directory: directory,
				downloadConf: conf,
				managerConf: conf[data.command]
			});
		}
		instance[data.method || "run"]();
	} else {
		winston.log("error", "no manager file named "+manager+".js found in plugins/magicdl/managers folder for command "+data.command);
	}
}