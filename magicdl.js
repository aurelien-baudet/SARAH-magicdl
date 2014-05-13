var fs = require('fs'),
	winston = require('winston'),
	instances = {};



var a = [
{"name":"THE OTHER WOMAN","phonetic":"| ði ˈʌðə ˈwʊmən |"},
{"name":"Squatters","phonetic":"| ˈskwɒtəz |"},
{"name":"Godzilla","phonetic":"| ˌɡɑːdˈzɪlə |"},
{"name":"The Phantom Carriage1921","phonetic":"| ðə ˈfæntəm <carriage1921> |"},
{"name":"The Amazing Spider Man 2","phonetic":"| ði əˈmeɪzɪŋ ˈspaɪdə mæn tuː |"},
{"name":"Draft Day","phonetic":"| drɑːft deɪ |"},
{"name":"X Men Days of Future Past","phonetic":"| eks men deɪz əv ˈfjuːtʃə pɑːst |"},
{"name":"Rio 2","phonetic":"| ˈriːəʊ tuː |"},
{"name":"300 Rise of an Empire","phonetic":"| θriː ˈhʌndrəd raɪz əv ən ˈempaɪə |"},
{"name":"Walking with Dinosaurs","phonetic":"| ˈwɔːkɪŋ wɪð ˈdaɪnəsɔːz |"},
{"name":"Transformers Age of Extinction","phonetic":"| trænsˈfɔːməz eɪdʒ əv ɪkˈstɪŋkʃn̩ |"},
{"name":"Neighbors","phonetic":"| ˈneɪbərz |"},
{"name":"Transcendence","phonetic":"| trænˈsendəns |"},
{"name":"Moms 039 Night Out","phonetic":"| mɒmz ˈθɜːti naɪn naɪt aʊt |"},
{"name":"Edge of Tomorrow","phonetic":"| edʒ əv təˈmɒrəʊ |"},
{"name":"Divergent","phonetic":"| daɪˈvɜːdʒənt |"},
{"name":"Fading Gigolo","phonetic":"| ˈfeɪdɪŋ ˈʒɪɡələʊ |"},
{"name":"Heaven Is For Real","phonetic":"| ˈhevn̩ z fə rɪəl |"},
{"name":"A Haunted House 2","phonetic":"| ə ˈhɔːntɪd ˈhaʊs tuː |"},
{"name":"Jack ryan Operacion sombra","phonetic":"| dʒæk ˈraɪən <operacion> <sombra> |"},
{"name":"Ready to Die","phonetic":"| ˈredi tə daɪ |"},
{"name":"Hartsbegeertes","phonetic":"| <hartsbegeertes> |"},
{"name":"Brick Mansions","phonetic":"| brɪk ˈmænʃn̩z |"},
{"name":"The Fox Lover","phonetic":"| ðə fɒks ˈlʌvə |"},
{"name":"RoboCop","phonetic":"| ˈroboˌkɑːp |"},
{"name":"Rob the Mob","phonetic":"| rɒb ðə mɒb |"},
{"name":"Ready 2 Die","phonetic":"| ˈredi tuː daɪ |"},
{"name":"Separadas al Nacer","phonetic":"| <separadas> æl <nacer> |"},
{"name":"Jack Ryan Shadow Recruit","phonetic":"| dʒæk ˈraɪən ˈʃædəʊ rɪˈkruːt |"},
{"name":"Extraction","phonetic":"| ɪkˈstrækʃn̩ |"},
{"name":"Gunday","phonetic":"| <gunday> |"},
{"name":"Silent witness","phonetic":"| ˈsaɪlənt ˈwɪtnəs |"},
{"name":"Dhoom 3","phonetic":"| <dhoom> θriː |"},
{"name":"Captain America The Winter Soldier","phonetic":"| ˈkæptɪn əˈmerɪkə ðə ˈwɪntə ˈsəʊldʒə |"},
{"name":"Bewakoofiyaan","phonetic":"| <bewakoofiyaan> |"},
{"name":"House Of Cards","phonetic":"| ˈhaʊs əv kɑːdz |"},
{"name":"Butcher Boys","phonetic":"| ˈbʊtʃə ˈbɔɪz |"},
{"name":"Al encuentro de Mr Banks","phonetic":"| æl <encuentro> də ˈmɪstə bæŋks |"},
{"name":"The Blues Brothers Movie 1980 Full","phonetic":"| ðə bluːz ˈbrʌðəz ˈmuːvi wʌn ˈθaʊzn̩d naɪn ˈhʌndrəd ənd ˈeɪti fʊl |"},
{"name":"Under The Skin","phonetic":"| ˈʌndə ðə skɪn |"},
{"name":"The Grand Budapest Hotel","phonetic":"| ðə ɡrænd ˈbjuːdəpest ˌhəʊˈtel |"},
{"name":"Noah","phonetic":"| ˈnəʊə |"},
{"name":"The House Of Magic","phonetic":"| ðə ˈhaʊs əv ˈmædʒɪk |"},
{"name":"The Lego Movie","phonetic":"| ðə ˈleɡəʊ ˈmuːvi |"},
{"name":"Need For Speed","phonetic":"| niːd fə spiːd |"},
{"name":"I Frankenstein","phonetic":"| ˈaɪ ˈfræŋkənˌstaɪn |"},
{"name":"Non Stop","phonetic":"| nɒn stɒp |"},
{"name":"That Awkward Moment","phonetic":"| ðət ˈɔːkwəd ˈməʊmənt |"},
{"name":"Tricked","phonetic":"| trɪkt |"},
{"name":"Not Safe For Work","phonetic":"| nɒt seɪf fə ˈwɜːk |"},
{"name":"L'Ordre des gardiens The Hunters","phonetic":"| <l'ordre> dez <gardiens> ðə ˈhʌntəz |"}
];

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
//	var PhoneticToTTS = require("./lib/nameProvider/transformer/PhoneticToTTS"),
//	Photransedit = require("./lib/nameProvider/transformer/Photransedit"),
//	Item = require('./lib/Item');
//	var transformer = new PhoneticToTTS();
//	var idx = 0;
//	transformer.on('done', function(item, name) {
//		debugger;
//		console.log(item.getName());
//		SARAH.speak(name, function() {
//			setTimeout(function() {
//				transformer.transform(new Item(a[++idx].name), a[idx].phonetic);
//			}, 5000);
//		});
//	});
//	transformer.transform(new Item(a[idx].name), a[idx].phonetic);
	
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