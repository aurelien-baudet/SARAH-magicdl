/*
 * Freebox module
 */


/*
	INITIALISATION
 */

var http         = require('http'),
	request      = require('request'),
	parseString  = require('xml2js').parseString,
	crypto       = require('crypto'),
	EventEmitter = require('events').EventEmitter;

controller = new EventEmitter();



//Freebox informations
var freebox = {
		ip         : 'mafreebox.freebox.fr', //default
		port       : 80, //default

		url        : '',

		uid        : '', //freebox id
		deviceName : '',
		deviceType : '',

		apiCode    : '',
		apiVersion : '',
		apiBaseUrl : ''
	};



//
var app = {
		app_id        : "magicdl.sarah.freebox", 
		app_name      : "Magic download",
		app_version   : '0.0.1',
		device_name   : "SARAH",

		app_token     : '', 
		track_id      : '',

		status        : 'granted',
		logged_in     : false,

		challenge     : '',
		password      : '',
		session_token : '',

		permissions   : {}
	};






/**
 * flash method
 *
 * Just a debug message
 * 
 * @param  string msg  string type
 * @return void
 */
function flash(msg, type) {
	if(!type) type = 'error';

	if(type == 'error') {
		console.log("\nERROR : ");
	} 
	else {
		console.log('\nINFO : ');
	}

	console.log(msg);
	console.log("\n");
}





/*
	CONNECTION & INFORMATIONS
 */


/**
 * connect method
 *
 * Example :
 *
 * freebox.connect({
 * 	'ip'        : 'mafreebox.freebox.fr', (optional)
 * 	'port'      : 80, (optional)
 * 	'app_token' : '012345', (optional)
 * 	'track_id'  : '12', (optional)
 * });
 * 
 * Update freebox information
 * 
 * @return void
 */
controller.connect = function infos(box) {
	if(typeof box != 'undefined') {
		//Update ip (optional)
		if(typeof box.ip != 'undefined') freebox.ip = box.ip;
		//Update port (optional)
		if(typeof box.port != 'undefined') freebox.port = box.port;
		//app_token (optional)
		if(typeof box.app_token != 'undefined') app.app_token = box.app_token;
		//track_id (optional)
		if(typeof box.track_id != 'undefined') app.track_id = box.track_id;
	}

	request('http://'+freebox.ip+'/api_version', function (error, response, body) {

		if (!error && response.statusCode == 200) 
		{
			body = JSON.parse(body);

			freebox.uid        = body.uid;
			freebox.deviceName = body.device_name;
			freebox.deviceType = body.device_type;

			freebox.apiVersion = body.api_version;
			freebox.apiCode    = 'v'+body.api_version.substr(0,1);
			freebox.apiBaseUrl = body.api_base_url;

			freebox.url        = 'http://'+freebox.ip+':'+freebox.port+freebox.apiBaseUrl+freebox.apiCode+'/';

			controller.emit('ready', freebox);	

		}
		else
		{
			flash("connect: "+error);
		}

	});
}


/**
 * registerApp method
 *
 * Example :
 *
 * freebox.register();
 *
 * Register the app to the Freebox
 * A message will be displayed on the Freebox LCD asking the user to grant/deny access to the requesting app.
 * 
 * @return void
 */
controller.register = function registerApp() {

	//Asking for an app token

	var options = {
		url    : freebox.url+'login/authorize',
		method : 'POST',
		json   : {
			   "app_id"      : app.app_id,
			   "app_name"    : app.app_name,
			   "app_version" : app.app_version,
			   "device_name" : app.device_name
			},
		encode : 'utf-8'
	};

	request(options, function (error, response, body) {

		if (!error && response.statusCode == 200) 
		{
			//body = JSON.parse(body);

			app.app_token = body.result.app_token;
			app.track_id  = body.result.track_id;


			//Track authorization progress

			request(freebox.url+'login/authorize/'+app.track_id, function (error, response, body) {


				if (!error && response.statusCode == 200) 
				{
					body = JSON.parse(body);

					app.status    = body.result.status; //Normaly 'pending'
					app.challenge = body.result.challenge;

					controller.emit('registered', {
						app_token : app.app_token,
						track_id  : app.track_id,
						status    : app.status,
					});

				}
				else
				{
					flash("authorize: "+error);
				}

				//The user must accept the app on the box

			});
		}
		else
		{
			flash("register: "+error);
		}


	});

}

/**
 * loginApp method
 *
 * Play before each call to the box
 * 
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function loginApp(next) {

	if(app.status == 'granted') //If we know the app accepted by the box (user action)
	{

		//Update challenge and log the app if needed
		sessionApp(next);

	}
	else
	{
		//We check if the user has accepted the app
		isAccepted(function(app) {
			if(app.status == 'granted') { //The app is accepted

				//Go ahead : logging the app
				sessionApp(next);

			}
			else if (app.status != 'pending') //If the app is denied or timeout or revoked
			{
				flash("The app is not accepted. You must register it.", 'info');
			}
			else
			{
				flash("Waiting for the user to accept.", 'info'); //'pending'
			}

		})
	}
}

controller.isAccepted = function isAccepted(cb) {
	request(freebox.url+'login/authorize/'+app.track_id, function (error, response, body) {

		if (!error && response.statusCode == 200) 
		{
			body = JSON.parse(body);
			app.status = body.result.status;

			flash('APP is ' + app.status, 'info');

			cb && cb(app);
			controller.emit('status:'+app.status, app);
		}
		else 
		{
			flash("isAccepted: "+error);
		}

	});
}

function requestPermissions(permissions) {
	// FIXME: it seems that this request needs password used to log into the web interface 
	var options = {
			url    : freebox.url+'login/request_perms/',
			method : 'POST',
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			}, 
			json   : {
//				   "app_id"      : app.app_id,
//				   "app_name"    : app.app_name,
//				   "app_version" : app.app_version,
//				   "device_name" : app.device_name,
//				   "challenge"   : app.challenge,
//				   "password"    : app.password,
				   "permissions" : permissions
				},
			encode : 'utf-8'
		};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) 
		{
			body = JSON.parse(body);

			controller.emit('permissions', body);
		}
		else 
		{
			flash("requestPermissions: "+error);
		}

	});
}

controller.requestPermissions = function(permissions) {
	loginApp(function(){ requestPermissions(permissions); });
}

/**
 * sessionApp method
 *
 * Update login status and challenge.
 * If needed log the app = Ask for a session token.
 * 
 * @param  next 
 * @return void
 */
function sessionApp(next) {


	//Asking a new challenge

	request(freebox.url+'login', function (error, response, body) {

		if (!error && response.statusCode == 200) {

			body = JSON.parse(body);

			app.logged_in = body.result.logged_in; //Update login status
			app.challenge = body.result.challenge; //Update challenge

			//Update password
			app.password = crypto.createHmac('sha1', app.app_token).update(app.challenge).digest('hex'); 


			//If we're not logged_in

			if (!app.logged_in)
			{
				//POST app_id & password
				var options = {
					url    : freebox.url+'login/session/',
					method : 'POST',
					json   : {
						   "app_id"      : app.app_id,
						   "app_version" : app.app_version,
						   "password"    : app.password,
						},
					encode : 'utf-8'
				};

				request(options, function (error, response, body) {

					if ( !error && (response.statusCode == 200 || response.statusCode == 403) ) {

						app.challenge = body.result.challenge; //Update challenge

						if (response.statusCode == 200) { //OK
							app.session_token = body.result.session_token; //Save session token
							app.logged_in   = true; //Update login status
							app.permissions = body.result.permissions;

							if(next) next();
						}
						else if(response.statusCode == 403) { //Forbidden
							app.logged_in = false; //Update login status
							flash(body.msg + ' : ' + body.error_code);
						}

					}
					else
					{
						flash("login/session: "+error);
					}

				});
			}

		}
		else
		{
			flash("login: "+error);
		}

	});

}


/*
	STATS
 */

/**
 * stats method
 *
 * Return some stats about the box.
 *
 * @see http://dev.freebox.fr/sdk/os/rrd/ for all the options
 * 
 * @param  {string}    db         net, temp, dsl, switch
 * @param  {timestamp} date_start The requested start timestamp of the stats to get (optional)
 * @param  {timestamp} date_end   The requested end timestamp of the stats to get (optional)
 * @param  {int}       precision  (optional)
 * @param  {object}    fields     For just getting some fields (optional) ex : ['tx_1', 'tx_2']
 */
function stats(db, date_start, date_end, precision, fields, next) {

	if(app.permissions.settings) {

		var json = { db : db }

		if( date_start ) {
			json.date_start = date_start;
		}
		if( date_end ) {
			json.date_end = date_end;
		}
		if( precision ) {
			json.precision = precision;
		}
		if( fields ) {
			json.fields = fields;
		}


		var options = {
			url : freebox.url+'rrd',
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			}, 
			json : json,
			method : 'POST',
		};

		request(options, function (error, response, body) {

			if (!error && response.statusCode == 200) 
			{
				next(body.result); //return stats
			}
			else
			{
				flash("download stats: "+body);
			}

		});

	} else {
		next("No settings permission.")
	}


}

controller.stats = function (db, date_start, date_end, precision, fields, next) {
	loginApp(function(){ stats(db, date_start, date_end, precision, fields, next) });
}; 



/*
	DOWNLOADS
 */


/**
 * downloadsStats method
 *
 * Return the download stats
 *
 * Example : 
 * 
 *  freebox.downloadsStats(function(msg){
 *		console.log(msg);
 *	});
 *
 * @see http://dev.freebox.fr/sdk/os/download/#get-the-download-stats
 * 
 */
function downloadsStats(next) {

	if(app.permissions.downloader) {

		var options = {
			url : freebox.url+'downloads/stats',
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			}, 
			method : 'GET',
		};


		request(options, function (error, response, body) {

			body = JSON.parse(body);

			if (!error && response.statusCode == 200) 
			{

				next(body.result); //return stats
			}
			else
			{
				flash("download status: "+body);
			}

		});

	} else {
		next("No downloader permission.")
	}


}

controller.downloadsStats = function (next) {
	loginApp(function(){ downloadsStats(next) });
};


/**
 * downloads method
 *
 * Manage downloads.
 * 
 * With no id submitted it returns the entire downloads list.
 * With an id you can manage the selected download.
 *
 * Example : 
 * 
 *  freebox.downloads(2, udpate, {"io_priority": "high","status": "stopped"}, function(msg){
 *		console.log(msg);
 *	});
 *
 * @see http://dev.freebox.fr/sdk/os/download/#download-api
 * 
 * @param  {int}    id      The id of the download. If null, it will return the entire download list
 * @param  {string} action  The action to do if and id is submited. Could be read, log, udpate, delete and deleteAndErase - delete the download and erase the files downloaded. If null, it's set to read.
 * @params {json}   params  If action update, the item to update.
 * 
 */
function downloads(id, action, params, next) {

	if(app.permissions.downloader) {

		//All the download list
		if(!id) {

			var options = {
				url : freebox.url+'downloads/',
				headers : {
					'X-Fbx-App-Auth' : app.session_token
				}, 
				method : 'GET',
			};


			request(options, function (error, response, body) {

				if (!error && response.statusCode == 200) 
				{
					body = JSON.parse(body);

					if(typeof body.result == 'undefined') {
						next('No download');
					}
					else 
					{
						next(body.result); //return current downloads
					}
				}
				else
				{
					flash("downloads: "+body);
				}

			});

		}
		//Download {id}
		else {

			var options = {
				url : freebox.url+'downloads/'+id,
				headers : {
					'X-Fbx-App-Auth' : app.session_token
				}, 
				json : {},
				method : 'GET',
			};

			//What to do ?

			if(!action) action = 'read';

			switch(action) {
				case 'delete' :
					options.method = 'DELETE';
					break;

				case 'deleteAndErase' :
					options.url    += '/erase';
					options.method = 'DELETE';
					break;

				case 'update' :
					options.method = 'PUT';
					options.json   = params;
					break;

				case 'log' : 
					options.url    += '/log';
					options.method = 'GET';
					break;

				case 'read' : break;

				default :
					next('This action doesn\'t exist. Try read, log, update, delete or deleteAndErase.');
					break;
			}


			request(options, function (error, response, body) {

				if (!error && response.statusCode == 200) 
				{

					if(typeof body.result == 'undefined' && (action == 'delete' || action == 'deleteAndErase') ) {
						next('Deleted.');
					}
					else if(typeof body.result == 'undefined') {
						next('No download with this id.');
					}
					else 
					{
						next(body.result); //return current downloads
					}
				}
				else
				{
					flash("downloads: "+body);
				}

			});

		}

	} else {
		next("No downloader permission.")
	}

};

controller.downloads = function (id, action, params, next) {
	loginApp(function(){ downloads(id, action, params, next) });
}; 




/**
 * addDownloads method
 *
 * Add one or multiple download(s) to the queue.
 *
 * Example :
 *
 * 	freebox.addDownloads(
 *		"http://blog.baillet.eu/public/ciel-bleu-sans-avion-20100417-imgis5346.jpg\nhttp://www.8alamaison.com/wp-content/uploads/2013/04/z2354-carton-rouge3.gif",
 *		null, false, null, null, null,
 *		function(msg) {
 *			console.log(msg);
 *		}
 *	);
 * 
 * @param {string}   url              Url(s) to download. If multiple, separated by a new line delimiter "\n"
 * @param {string}   dir              The download destination directory (optional)
 * @param {bool}     recursive        If true the download will be recursive. See http://dev.freebox.fr/sdk/os/download/#adding-by-url
 * @param {string}   username         (optional)
 * @param {string}   password         (optional)
 * @param {string}   archive_password Pasword to decompress the erchive if nzb.
 * 
 */
function addDownloads(url, dir, recursive, username, password, archive_password, next) {

	if(app.permissions.downloader) {

		//Form to submit

		var form = {
			'download_url_list' : url,
			'recursive'         : recursive,
		};

		if(dir) {
			form.download_dir = dir;
		}

		if(username && password) {
			form.username = username;
			form.password = password;

		}

		if(archive_password) {
			form.archive_password = archive_password;
		}


		//Request options

		var options = {
			url : freebox.url+'downloads/add',
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			}, 
			form : form,
			method : 'POST',
		};


		request(options, function (error, response, body) {

			body = JSON.parse(body);

			if (!error && response.statusCode == 200) 
			{

				next(body.result); //return the new download(s)

			}
			else
			{
				flash("add downloads: "+body);
			}

		});

	} else {
		next("No downloader permission.")
	}

}

controller.addDownloads = function (url, dir, recursive, username, password, archive_password, next) {
	loginApp(function(){ addDownloads(url, dir, recursive, username, password, archive_password, next) });
}; 


controller.encodePath = function(path) {
	return path ? new Buffer(path).toString('base64') : null;
}


controller.share = {}

function shareLink(file, next) {
	var options = {
		url : freebox.url+'share_link/',
		headers : {
			'X-Fbx-App-Auth' : app.session_token
		}, 
		json : {
			path: file,
			expire: new Date().valueOf()+30*24*60*60*1000
		},
		method : 'POST',
	};


	request(options, function (error, response, body) {


		if (!error && response.statusCode == 200) 
		{
			//body = JSON.parse(body);
			next(body.result); //return the new download(s)

		}
		else
		{
			flash("share link: "+body);
		}

	});
}

controller.share.create = function (file, next) {
	loginApp(function(){ shareLink(file, next) });
}; 


controller.airmedia = {
	config: {},
	receivers: {}
}

function airmediaPlay(url, next) {
	var options = {
		url : freebox.url+'airmedia/receivers/Freebox%20Player/',
		headers : {
			'X-Fbx-App-Auth' : app.session_token
		}, 
		json : {
			action: "start",
			media_type: "video",
			media: url
		},
		method : 'POST',
	};


	request(options, function (error, response, body) {

		if (!error && response.statusCode == 200) 
		{
			next(body.result);

		}
		else
		{
			flash("air media play: "+body);
		}

	});
}

controller.airmedia.receivers.play = function(url, next) {
	loginApp(function(){ airmediaPlay(url, next) });
}




function updateConnectionConfig(connectionConfiguration, next) {
	var options = {
		url : freebox.url+'connection/config/',
		headers : {
			'X-Fbx-App-Auth' : app.session_token
		}, 
		json : connectionConfiguration,
		method : 'PUT'
	};


	request(options, function (error, response, body) {

		if (!error && response.statusCode == 200) 
		{
			next(body.result);

		}
		else
		{
			flash("update connection config: "+body);
		}

	});
}

controller.connection = {
	config: {}
}

controller.connection.config.update = function(connectionConfiguration, next) {
	loginApp(function(){ updateConnectionConfig(connectionConfiguration, next) });
}


controller.fs = {
}

controller.fs.ls = function(path, next) {
	loginApp(prepareGetRequest('fs/ls/'+path, next));
//	loginApp(prepareGetRequest('fs/ls/'+path, next, function(err) {
//		sendGetRequest('fs/ls/'+path+controller.encodePath("/"), next);
//	}));
}

controller.fs.info = function(path, next) {
	// try with provided path and if error, then retry with trailing slash if it points to a folder
	loginApp(prepareGetRequest('fs/info/'+path, next, function(err) {
		sendGetRequest('fs/info/'+path+controller.encodePath("/"), next);
	}));
}

prepareGetRequest = function(url, next, error) {
	return sendGetRequest.bind(this, url, next, error);
}


sendGetRequest = function(url, next, error) {
	var options = {
			url : freebox.url+url,
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			}, 
			method : 'GET'
	};
//	console.log("===============================");
//	console.log("send request, url="+options.url);
	
	
	request(options, function (err, response, body) {
//		console.log("body:");
//		console.log(body);
		if (!err && response.statusCode == 200 && JSON.parse(body).result) 
		{
//			console.log("----------> success");
			next && next(JSON.parse(body).result);
		}
		else
		{
			error && error(body);
			flash(url+": "+body);
		}
	});
}


/*
	CALLS
 */

/**
 * calls method
 *
 * Return all the calls.
 */
function calls(next) {

	if(app.permissions.calls) {

		var options = {
			url : freebox.url+'call/log/',
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			}, 
			method : 'GET',
		};

		request(options, function (error, response, body) {

			body = JSON.parse(body);

			if (!error && response.statusCode == 200) 
			{
				next(body.result); //return all the calls
			}
			else
			{
				flash(error);
			}

		});


	} else {
		next("No calls permission.")
	}
}

controller.calls = function (next) {
	loginApp(function(){ calls(next) });
}; 

/**
 * call method
 *
 * Manage a call.
 * 
 * @param  {int}      id     	Call id
 * @param  {string}   action 	The action to do. Read (default), update, delete.
 * @param  {json}     params 	If update, params to update.
 */
function call(id, action, params, next) {

	if(app.permissions.calls) {

		var options = {
			url : freebox.url+'call/log/'+id,
			headers : {
				'X-Fbx-App-Auth' : app.session_token
			},
			json : {},
			method : 'GET',
		};

		switch(action) {
			case null :
			case 'read' :
				break;

			case 'update' :
				options.method = "PUT";
				options.json = params;
				break;

			case 'delete' :
				options.method = "DELETE";
				break;
		}

		request(options, function (error, response, body) {

			if (!error && response.statusCode == 200) 
			{
				next(body.result); 
			}
			else
			{
				flash(error);
			}

		});


	} else {
		next("No calls permission.")
	}
}

controller.call = function (id, action, params, next) {
	loginApp(function(){ call(id, action, params, next) });
}; 


//Exports the module

module.exports = controller;


