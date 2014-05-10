SARAH plugin : magidl
=====================


# Description

Plugin pour S.A.R.A.H. (http://encausse.wordpress.com/s-a-r-a-h/) qui permet de télécharger des films ou des séries.

Par exemple, vous pouvez utiliser ce plugin pour :
- Rechercher vos séries sur le site Cpasbien, télécharger via la freebox (nécessite l'autorisation sur votre Freebox) puis regarder sur la freebox
- Rechercher des films sur The Pirate Bay, télécharger en utilisant Vuze (pas d'installation nécessaire) et de les lire avec VLC

Le plugin a été développé de manière à pouvoir interchanger n'importe quelle partie (Outil de recherche, outil de téléchargement et lecteur) par une autre.
De plus, il est totalement extensible pour que vous puissiez rajouter :
 - Vos propres systèmes de recherche (site internet, flux rss, ...)
 - Votre propre outil de téléchargement
 - Vos propres lecteurs
 - Vos propres managers (bout de code permettant d'orchestrer les différentes parties)

Ce plugin utilise une version modifiée de l'utilitaire pour commander la freebox (https://github.com/guillaumewuip/freeboxApi_node) qui m'a vraiment simplifié l'intégration de la freebox.

Les sources sont disponibles sur GitHub: https://github.com/aurelien-baudet/SARAH-magicdl.git


# Tester


## Utiliser l'auto-détéction

### Introduction

L'auto détection est capable de scanner votre environnement pour savoir ce qui est disponible chez vous. Pour le moment, l'auto détection va vérifier si vous possédez une Freebox et l'utiliser si présente.
Sinon, elle va tester la présence de Java et de VLC sur le PC où est installé SARAH. Si c'est le cas, alors le téléchargement se fera en local en utilisant Vuze et la lecture se fera avec VLC.

### Démarrage

Si une Freebox est détectée, il faut accepter l'application SARAH sur votre Freebox pour que SARAH puisse la piloter. Au premier lancement, SARAH vous demande d'accepter l'application sur votre freebox en choisissant oui sur l'écran LCD de votre freebox.

### Choisir vos séries

Pour indiquer à SARAH la liste des séries que vous souhaitez visionner, il suffit d'éditer le fichier download.json et modifier le tableau nommé list. Chaque entrée du tableau est un objet qui contient les informations suivantes :
- regexp (obligatoire) : une expression régulière permettant de filtrer les résultats fournis par le flux RSS de Cpasbien
- directory (optionnel) : le dossier dans lequel le fichier sera téléchargé dans votre freebox

exemple :
```JSON
{
	"series": {
		"list": [{
			"regexp": "suits.*VOST.*",
			"directory": "/Disque dur/Séries/suits"
		}, {
			"regexp": "arrow.*VOST.*",
			"directory": "/Disque dur/Séries/Arrow"
		}, {
			"regexp": "walking dead.*VOST.*",
			"directory": "/Disque dur/Séries/Walking dead"
		}, {
			"regexp": "the big bang theory.*VOST.*",
			"directory": "/Disque dur/Séries/The big bang theory"
		}, {
			"regexp": "game of thrones.*VOST.*",
			"directory": "/Disque dur/Séries/Game of thrones"
		}, {
			"regexp": "helix.*VOST.*",
			"directory": "/Disque dur/Séries/Helix"
		}, {
			"regexp": "mentalist.*VOST.*",
			"directory": "/Disque dur/Séries/Mentalist"
		}]
	},
	"movies": {
	}
}
```

### Lancer la recherche des séries

Il vous suffit de dire "SARAH télécharge mes séries". SARAH téléchargera automatiquement toutes les séries fournies dans le fichier download.json qui n'ont pas déjà été téléchargées.


### Lancer la recherche des films

Il vous suffit de dire "SARAH télécharge des films". SARAH va chercher sur The Pirate Bay la liste des films récemment ajoutés. Pour chaque nouveau film trouvé, elle vous propose de le télécharger.
A vous d'accepter ou refuser vocalement le téléchargement.


## Mode manuel

### Vous avez une Freebox Revolution

#### Introduction

Vous pouvez utiliser votre freebox pour télécharger des films ou séries et les visionner une fois terminés avec le player de votre freebox.
Utilisez le manager nommé "rss-cpasbien-series+freeboxdl+freeboxairmedia" dans le fichier download.json. Ce manager recherche sur le site Cpasbien les nouvelles séries disponibles (flux RSS).
Il compare les entrées trouvées avec la liste que vous avez fournie dans le fichier download.json. Si une (ou plusieurs) correspondances sont trouvées, le manager va télécharger ces fichiers
en utilisant votre freebox. Une fois l'un des téléchargement terminé, SARAH vous propose de lire ce fichier.

#### Autoriser l'application

Pour pouvoir piloter votre freebox, l'application SARAH doit être autorisée sur votre freebox. Au premier lancement, SARAH vous demande d'accepter l'application sur votre freebox en choisissant oui sur l'écran
LCD de votre freebox.

#### Choisir vos séries

Pour indiquer à SARAH la liste des séries que vous souhaitez visionner, il suffit d'éditer le fichier download.json et modifier le tableau nommé list. Chaque entrée du tableau est un objet qui contient les informations suivantes :
- regexp (obligatoire) : une expression régulière permettant de filtrer les résultats fournis par le flux RSS de Cpasbien
- directory (optionnel) : le dossier dans lequel le fichier sera téléchargé dans votre freebox

exemple :
```JSON
{
	"series": {
		"manager": "rss-cpasbien-series+freeboxdl+freeboxairmedia",
		"list": [{
			"regexp": "suits.*VOST.*",
			"directory": "/Disque dur/Séries/suits"
		}, {
			"regexp": "arrow.*VOST.*",
			"directory": "/Disque dur/Séries/Arrow"
		}, {
			"regexp": "walking dead.*VOST.*",
			"directory": "/Disque dur/Séries/Walking dead"
		}, {
			"regexp": "the big bang theory.*VOST.*",
			"directory": "/Disque dur/Séries/The big bang theory"
		}, {
			"regexp": "game of thrones.*VOST.*",
			"directory": "/Disque dur/Séries/Game of thrones"
		}, {
			"regexp": "helix.*VOST.*",
			"directory": "/Disque dur/Séries/Helix"
		}, {
			"regexp": "mentalist.*VOST.*",
			"directory": "/Disque dur/Séries/Mentalist"
		}]
	},
	"movies": {
		"manager": "rss-thepiratebay-movies+freeboxdl+freeboxairmedia"
	}
}
```

#### Lancer la recherche des séries

Il vous suffit de dire "SARAH télécharge mes séries". SARAH téléchargera automatiquement toutes les séries fournies dans le fichier download.json qui n'ont pas déjà été téléchargées.


#### Lancer la recherche des films

Il vous suffit de dire "SARAH télécharge des films". SARAH va chercher sur The Pirate Bay la liste des films récemment ajoutés. Pour chaque nouveau film trouvé, elle vous propose de le télécharger.
A vous d'accepter ou refuser vocalement le téléchargement.



### Pas de Freebox (utilisation de Vuze et VLC)

#### Mise en place

Si vous ne possédez pas de freebox et que vous voulez tester le plugin, alors il suffit de remplacer le contenu du fichier download.json par celui de download.back.json.
Vous remplacez alors l'utilisation de la freebox par l'utilisation de Vuze pour télécharger et VLC pour visualiser.
Vous n'avez pas besoin d'installer Vuze sur votre PC (par contre, il faut Java). J'utilise une version console de Vuze embarquée directement dans le plugin.
Vous devez par contre installer VLC si ce n'est pas déjà le cas (utilisez le chemin par défaut pour le moment).

#### Choisir vos séries

Pour indiquer à SARAH la liste des séries que vous souhaitez visionner, il suffit d'éditer le fichier download.json et modifier le tableau nommé list. Chaque entrée du tableau est un objet qui contient les informations suivantes :
- regexp (obligatoire) : une expression régulière permettant de filtrer les résultats fournis par le flux RSS de Cpasbien

exemple :
```JSON
{
	"series": {
		"list": [{
			"regexp": "suits.*VOST.*",
			"directory": "/Disque dur/Séries/suits"
		}, {
			"regexp": "arrow.*VOST.*",
			"directory": "/Disque dur/Séries/Arrow"
		}, {
			"regexp": "walking dead.*VOST.*",
			"directory": "/Disque dur/Séries/Walking dead"
		}, {
			"regexp": "the big bang theory.*VOST.*",
			"directory": "/Disque dur/Séries/The big bang theory"
		}, {
			"regexp": "game of thrones.*VOST.*",
			"directory": "/Disque dur/Séries/Game of thrones"
		}, {
			"regexp": "helix.*VOST.*",
			"directory": "/Disque dur/Séries/Helix"
		}, {
			"regexp": "mentalist.*VOST.*",
			"directory": "/Disque dur/Séries/Mentalist"
		}]
	},
	"movies": {
	}
}
```

#### Lancer la recherche des séries

Il vous suffit de dire "SARAH télécharge mes séries". SARAH téléchargera automatiquement toutes les séries fournies dans le fichier download.json qui n'ont pas déjà été téléchargées.


#### Lancer la recherche des films

Il vous suffit de dire "SARAH télécharge des films". SARAH va chercher sur The Pirate Bay la liste des films récemment ajoutés. Pour chaque nouveau film trouvé, elle vous propose de le télécharger.
A vous d'accepter ou refuser vocalement le téléchargement.





# Etendre le plugin

## Recherche (searcher)

Un searcher permet de fournir une liste de films ou séries sans filtrage.

### Systèmes de recherche existants

Il existe deux systèmes de recherches :
- RssSearch : permet de lire un flux rss pour renvoyer la liste des films ou séries
- HtmlSearch (en cours) : permet de faire une recherche sur n'importe quel moteur de recherche. Utilise cheerio pour retrouver le nom et l'url


### Ajouter un système de recherche

L'interface d'un searcher est simple :
- 1 méthode search sans paramètre
- 2 événements à déclencher : "done" lorsque la recherche est terminée et "error" si la recherche n'a pas pu aboutir

L'événement "done" doit fournir une liste d'instances de la classe Item. Le constructeur de la classe Item prend 2 paramètres :
- le nom de l'élément trouvé (sans transformation)
- le lien vers l'item

Pour l'exemple, voici le code pour un searcher qui fournit une liste statique :

```JavaScript
var Item = require('../Item'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

MockSearch = function() {
	EventEmitter.call(this);
}


util.inherits(MockSearch, EventEmitter);


MockSearch.prototype.search = function() {
	var foundItems = [
		new Item("movie 1", "http://thepiratebay/movie1.torrent"),
		new Item("[foo] movie.2.with.unspeakablename.XVID", "http://anypage/movie2.html")
	];
	setTimeout(this.emit.bind(this, 'done', foundItems), 0);
}


module.exports = MockSearch;
```

Comme vous le constatez, j'utilise setTimeout. Ceci est pour forcer l'asynchronisme. Ici, on ne se soucie pas du formattage du nom ou de l'url.
Ce n'est pas le rôle du searcher. Il existe des nameProvider et des urlProvider pour gérer ça.

On a donc fini notre searcher de test.


## Filtres (filter)

Un filtre comme son nom l'indique permet de filtrer la liste des résultats fournie par le searcher.

### Filtres existants

Il existe actuellement 7 filtres :
- RegexpFilter : qui permet de filtrer les items avec une expression régulière
- RegexpListFilter : qui permet de filtrer avec une liste d'expressions régulières. Dès qu'une expression régulière match l'item alors l'item est accepté, sinon on passe à l'expression suivante
- UnreadFilter : qui permet de filtrer (rejeter) un item qui a déjà été fourni par un searcher. Stocke l'information en utilisant un store. Il existe plusieurs stores disponibles (MemoryStore, JsonStore, ...)
- AskFilter (en cours) : SARAH demande à l'utilisateur si l'item est accepté ou non
- AndFilter : permet de faire un ET logique entre des filtres. Parcours la liste des filtres fournis et s'arrête dès qu'un filtre rejete l'item. Si aucun filtre n'a rejeté l'item alors l'item est accepté
- OrFilter : permet de faire un OU logique entre des filtres. Parcours la liste des filtres fournis et s'arrête dès qu'un filtre accepte l'item. Si aucun filtre n'a accepté l'item alors l'item est rejeté
- AcceptFilter : qui accepte n'importe quel item

### Ajouter un filtre

L'interface d'un filtre est la suivante :
- 1 méthode accept qui vérifie si l'item est accepté ou rejeté
- 1 événement "accepted" si l'item est accepté
- 1 événement "rejected" si l'item est rejeté
- 1 événement "done" une fois que le filtre est passé (accepté ou rejeté)

Voici un exemple de filtre qui accepte n'importe quel item :
```JavaScript
var EventEmitter = require('events').EventEmitter,
	util = require('util');

	
function AcceptFilter() {
}

util.inherits(AcceptFilter, EventEmitter);


AcceptFilter.prototype.accept = function(/*Item*/item, /*Integer*/idx, /*Item[]*/items) {
	setTimeout(this.emit.bind(this, 'accepted', item), 0);
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = AcceptFilter;
```


## Fournisseur de nom prononcable (nameProvider)

Un nameProvider est une classe qui prend un Item et détermine un nom prononcable par SARAH.
Un nameProvider doit appeler 

### nameProvider existants

Il existe deux nameProvider :
- NullNameProvider : qui utilise directement le nom brut en tant que nom prononcable
- RegexpNameProvider : qui uilise une expression régulière à appliquer sur le nom brut pour en extraire une partie prononcable

### Ajouter un nameProvider

L'interface d'un nameProvider est la suivante :
- 1 méthode setSpeakName qui permet de fournir un nom prononcable. Doit appeler la méthode setSpeakName sur l'Item passé en paramètre
- 1 événement "done" qui est déclenché une fois que le nom prononcable est déterminé.

Voici le code du NullNameProvider qui est assez simple pour servir d'exemple :
```JavaScript
var EventEmitter = require('events').EventEmitter,
	util = require('util');
	
function NullNameProvider() {
	EventEmitter.call(this);
}

util.inherits(NullNameProvider, EventEmitter);


NullNameProvider.prototype.setSpeakName = function(/*Item*/item) {
	item.setSpeakName(item.getSpeakName());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = NullNameProvider;
```


## Fournisseur de lien de téléchargement (urlProvider)

Un urlProvider permet de fournir une url prête pour le téléchargement à partir de l'item fourni.
En effet, certains sites ne fournissent pas directement le lien vers le fichier mais un lien vers une page contenant
la description du fichier à télécharger. C'est dans cette page qu'on peut trouver l'url qui nous intéresse.

### urlProvider existants

Il existe actuellement deux urlProvider :
- NullUrlProvider : qui ne fat aucun traitement sur l'item et renvoi l'url d'origine fournie par le searcher en tant qu'url de téléchargement
- HtmlRegexpUrlProvider : qui fait une requête vers la page pointée par l'url d'origine fournie par le searcher, utilise une expresson régulière et un préfixe optionnel pour trouver et reconstituer une url vers le fichier réel

### Ajouter un urlProvider

L'interface d'un urlProvider est la suivante :
- 1 méthode setDownloadUrl qui permet de fournir une url vers un fichier. Doit appeler la méthode setDownloadUrl sur l'Item passé en paramètre
- 1 événement "done" qui est déclenché une fois que l'url est déterminée.

Voici le code du NullUrlProvider qui est assez simple pour servir d'exemple :
```JavaScript
var EventEmitter = require('events').EventEmitter,
	util = require('util');


function NullUrlProvider() {
	EventEmitter.call(this);
}

util.inherits(NullUrlProvider, EventEmitter);

NullUrlProvider.prototype.setDownloadUrl = function(/*Item*/item) {
	item.setDownloadUrl(item.getDownloadUrl());
	setTimeout(this.emit.bind(this, 'done', item), 0);
}


module.exports = NullUrlProvider;
```


## Outil de téléchargement (downloader)

### downloader existants

Il existe actuellement deux downloader :
- FreeboxDownloader : qui pilote votre freebox pour pouvoir ajouter un fichier à télécharger (torrent, NZB, ...) et le rend visible de l'extérieur pour pouvoir le lire par la suite
- VuzeDownloader : qui embarque le client torrent Vuze en mode console et permet de télécharger des fichiers torrent

### Ajouter un downloader

Un downloader doit respecter l'interface suivante :
- 1 méthode start prenant en paramètre un Item
- déclencher l'événement "started" lorsque le téléchargement a démarré
- fournir l'url de lecture en appelant la méthode setPalyUrl sur l'item téléchargé
- déclencher l'événement "downloaded" lorsque le téléchargement est terminé

Pour pouvoir déclencher l'événement "downloaded", un downloader doit donc soit scruter régulièrement l'état du téléchargement soit attendre un événement de l'outil de téléchargement

Voici un exemple qui simule un téléchargement :
```JavaScript
var EventEmitter = require('events').EventEmitter,
	util = require('util');

function MockDownloader() {
	EventEmitter.call(this);
}

util.inherits(MockDownloader, EventEmitter);


MockDownloader.prototype.start = function(/*Item*/item) {
	this.emit('started', item);
	item.setPlayUrl("http://foo.bar/movie.avi");
	setTimeout(this.emit.bind(this, 'downloaded', item), 8000);
}


module.exports = MockDownloader;
```

## Lecteur (player)

### player existants

Il existe également deux players existants :
- FreeboxAirMedia : qui permet d'utiliser la fonctionnalité AirMedia de la freebox
- Vlc : qui utilise le lecteur Vlc installé sur le serveur où SARAH est installé (pour le moment)

### Ajouter un player

L'interface d'un player est la suivante :
- 1 méthode play qui permet de lancer la lecture
- (bientôt) des événements pour connaitre l'état de la lecture. L'événement intéressant est l'événement "completed" qui permettre à SARAH de demander la lecture du fichier suivant dans le cas où plusieurs fichiers ont été téléchargés pendant que la lecture était en cours


```JavaScript
function MockPlayer() {
}

MockPlayer.prototype.play = function(/*Item*/item) {
	// just start playing
	console.log("start playing "+item.getName());
}


module.exports = MockPlayer;
```

## Orchestrer les différentes parties (manager)

Pour lier tout ça ensemble, il faut définir un manager. Une classe de base définissant l'algorithme général existe.
Il suffit donc d'hériter de cette classe de base en fournissant au constructeur l'ensemble des éléments (searcher, filter, nameProvider, urlProvider, downloader, player).

### manager existants

Il existe 5 managers :
- rss-cpasbien-series+freeboxdl+freeboxairmedia : qui utilise les flux RSS de Cpasbien pour trouver les nouvelles séries disponibles, filtre en utilisant des expressions régulières, télécharge avec la freebox et lit les vidéos avec la freebox
- rss-cpasbien-series+vuze+vlc : qui utilise les flux RSS de Cpasbien pour trouver les nouvelles séries disponibles, filtre en utilisant des expressions régulières, télécharge avec la Vuze et lit les vidéos avec VLC
- rss-thepiratebay-movies+freeboxdl+freeboxairmedia : qui utilise les flux RSS de The Pirate Bay pour trouver les nouveaux films disponibles, filtre en vous demandant ce que vous souhaitez télécharger, télécharge avec la freebox et lit les vidéos avec la freebox
- rss-thepiratebay-movies+vuze+vlc : qui utilise les flux RSS de The Pirate Bay pour trouver les nouveaux films disponibles, filtre en vous demandant ce que vous souhaitez télécharger, télécharge avec la Vuze et lit les vidéos avec VLC
- AutoDetectManager : qui détecte automatiquement quel manager ci-dessus utiliser en fonction de votre environnement
 
### Créer son propre manager

Un manager doit respecter l'interface suivante :
- 1 méthode run sans paramètre
- 1 fonction statique d'intialisation (peut servir lors du démarrage de SARAH, par exemple enregistrer le plugin sur la freebox pour pouvoir la piloter)

Un manager doit impérativement être dans le dossier managers (pour l'instant).

Un manager standard peut hériter de la classe de base Manager. Voici un manager utilisant la classe de base et qui orchestre tous les exemples précédents :
```JavaScript
var MockSearch = require('../lib/search/MockSearch'),
	AcceptFilter = require('../lib/filter/AcceptFilter'),
	NullNameProvider = require('../lib/nameProvider/NullNameProvider'),
	NullUrlProvider = require('../lib/urlProvider/NullUrlProvider'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/manager/FullAsyncManager'),
	fs = require('fs'),
	util = require('util');
	

function Mock(sarahContext) {
	Manager.apply(this, [
		sarahContext,
		new MockSearch(),
		new AcceptFilter(),
		new NullNameProvider(),
		new NullUrlProvider(),
		new MockDownloader(),
		new MockPlayer()
	]);
}

util.inherits(Mock, Manager);


Mock.initialize = function(initCtx) {
	
}

module.exports = Mock;
```


### Comment indiquer à SARAH quel manager lancer ?

C'est bien beau tout ça, j'ai le code mais comment faire pour que SARAH le lance ?
Et bien pour ça, on utilise le fichier download.json.
Le format du fichier est le suivant :
```JSON
{
	"{command1}": {
		"manager": "{name of manager1}"
	},
	"{command2}": {
		"manager": "{name of manager2}",
		{configuration2}
	}
}
```

Avec :
- {command1} et {command2} correspondant au nom de la commande définie dans magicdl.xml (actuellement le fichier ne contient qu'une seule commande nommée "series").
- {name of manager1} et {name of manager2} correspondant au nom du fichier js disponible dans le dossier managers du manager que vous voulez lancer.
- {configuration2} : des propriétés optionnelles qui peuvent être utilisées dans votre manager.


Pour l'exemple précédent, on créé un manager qui se nomme mock.js dans le dossier managers et on le déclare comme suit :
```JSON
{
	"series": {
		"manager": "mock"
	}
}
```

### Utiliser l'auto détection

#### Ajouter la détection à votre manager

Pour pouvoir ajouter la détection à votre manager, vous devez :
- ajouter la dépendance à EventEmitter
- ajouter la fonction statique detect
- déclencher l'évènement 'available' une fois la détection effectuée avec un booléen (true pour pouvoir utiliser votre manager, false sinon)


```JavaScript
var MockSearch = require('../lib/search/MockSearch'),
	AcceptFilter = require('../lib/filter/AcceptFilter'),
	NullNameProvider = require('../lib/nameProvider/NullNameProvider'),
	NullUrlProvider = require('../lib/urlProvider/NullUrlProvider'),
	MockDownloader = require('../lib/downloader/MockDownloader'),
	MockPlayer = require('../lib/player/MockPlayer'),
	Manager = require('../lib/Manager'),
	fs = require('fs'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;
	

function Mock(sarahContext) {
	Manager.apply(this, [
		sarahContext,
		new MockSearch(),
		new AcceptFilter(),
		new NullNameProvider(),
		new NullUrlProvider(),
		new MockDownloader(),
		new MockPlayer()
	]);
}

util.inherits(Mock, Manager);


Mock.initialize = function(initCtx) {
	
}


Mock.ee = new EventEmitter();

Mock.detect = function(detectCtx) {
	setTimeout(Mock.ee.emit.bind(Mock.ee, 'available', true), 0);
}

module.exports = Mock;
```

Dans notre cas, la détection renvoie toujours true et donc notre manager est toujours disponible.


#### Utiliser l'AutoDetectManager

Si vous ne spécifiez aucun manager dans le fichier download.json alors, c'est le manager d'auto détection qui est automatiquement utilisé.

Exemple :
```JSON
{
	"series": {
		"list": [{
			"regexp": "suits.*VOST.*",
			"directory": "/Disque dur/Séries/suits"
		}, {
			"regexp": "arrow.*VOST.*",
			"directory": "/Disque dur/Séries/Arrow"
		}, {
			"regexp": "walking dead.*VOST.*",
			"directory": "/Disque dur/Séries/Walking dead"
		}, {
			"regexp": "the big bang theory.*VOST.*",
			"directory": "/Disque dur/Séries/The big bang theory"
		}, {
			"regexp": "game of thrones.*VOST.*",
			"directory": "/Disque dur/Séries/Game of thrones"
		}, {
			"regexp": "helix.*VOST.*",
			"directory": "/Disque dur/Séries/Helix"
		}, {
			"regexp": "mentalist.*VOST.*",
			"directory": "/Disque dur/Séries/Mentalist"
		}]
	},
	"movies": {
	}
}
```


Ensuite, pour ajouter votre manager à l'auto détection, il vous suffit d'ajouter une entrée dans le fichier autodetect.json :
```JSON
{
	"series": ["mock", "rss-cpasbien-series+freeboxdl+freeboxairmedia", "rss-cpasbien-series+vuze+vlc"],
	"movies": ["rss-thepiratebay-movies+freeboxdl+freeboxairmedia", "rss-thepiratebay-movies+vuze+vlc"]
}
```

Ici on ajoute le manager mock à la commande 'series'. Ce manager étant le premier de la liste, c'est celui-ci qui sera utilisé si sa détection renvoie true. Sinon on passe au suivant et ainsi de suite.


# A faire

- Rendre les fichiers téléchargés par vuze accessible sur le réseau pour une lecture à distance (en cours)
- Améliorer les noms dictés (surtout avec The Pirate Bay)
- Recherche automatique régulière (cron)
- Stocker la liste des éléments téléchargés et les injecter dans le fichier xml pour une lecture ultérieure
- Faire des recherches de sous-titres correspondant à un film ou épisode de série
- Pouvoir combiner les recherches (exemple : rechercher sur Cpasbien, si non trouvé alors rechercher sur The Pirate Bay)
- Pouvoir lire sur n'importe quel player DLNA
- Télécharger des fchiers NZB
- Information sur la progression du téléchargement
- Pouvoir combiner les managers
