var fs = require('fs'),
	winston = require('winston'),
	object = require("./lib/util/object"),
	reset = require("./lib/reset/reset"),
	instances = {},
	standbyRegistry = [];


if(process.env.MAGICDL_MODE=="dev") {
	winston.level = "debug";
}

reset.run();

exports.init = function(SARAH) {
	var directory = './plugins/magicdl/';
	var conf = JSON.parse(require('fs').readFileSync(directory+'download.json', 'utf8'));
	var autodetect = JSON.parse(require('fs').readFileSync(directory+'autodetect.json', 'utf8'));
	var commands = [];
	for(var context in autodetect) {
		for(var action in autodetect[context]) {
			commands.push(context+"."+action);
		}
	}
	next(SARAH, directory, conf, commands, 0);
}

	
exports.action = function (data, callback, config, SARAH) {
	start(data, callback, config.modules.magicdl, SARAH);
}


exports.cron = function(callback, task, SARAH) {
	start({directory: __dirname+"/../../script", command: "cron.series", method: "run"}, callback, task, SARAH);
}

exports.standBy = function(motion, data, SARAH) {
	for(var i=0, l=standbyRegistry.length ; i<l ; i++) {
		standbyRegistry[i](motion, data, SARAH);
	}
}

exports.registerStandBy = function(func) {
	standbyRegistry.push(func);
}

start = function(data, callback, config, SARAH) {
	var directory = data.directory + '/../plugins/magicdl/';
	var conf = JSON.parse(require('fs').readFileSync(directory+'download.json', 'utf8'));
	var commandConf = object.get(conf, data.command);
	var manager = (commandConf && commandConf.manager) || "AutoDetectManager";
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
				managerConf: getCommandConf(conf, data.command),
				plugin: exports
			});
			instance.register();
		}
		instance[data.method || "run"]();
	} else {
		winston.log("error", "no manager file named "+manager+".js found in plugins/magicdl/managers folder for command "+data.command);
	}
}


getCommandName = function(/*String*/command) {
	var parts = command.split(".");
	return parts[parts.length-1];
}

getCommandConf = function(/*Object*/downloadConf, /*String*/command) {
	return downloadConf[getCommandName(command)];
}

next = function(SARAH, /*String*/directory, /*Map*/conf, /*String[]*/actions, /*Integer*/idx) {
	if(idx<actions.length) {
		initialize(SARAH, directory, conf, actions, idx, actions[idx]);
	} else {
		// nothing to do
	}
}

initialize = function(SARAH, /*String*/directory, /*Map*/conf, /*String[]*/actions, /*Integer*/idx, /*String*/action) {
	var commandConf = object.get(conf, action);
	var manager = (commandConf && commandConf.manager) || "AutoDetectManager";
	var Manager = require('./managers/'+manager);
	Manager.initialize({
		SARAH: SARAH,
		directory: directory,
		downloadConf: conf,
		managerConf: getCommandConf(conf, action),
		action: action,
		plugin: exports
	});
	Manager.ee.once('done', next.bind(Manager.ee, SARAH, directory, conf, actions, idx+1));
}