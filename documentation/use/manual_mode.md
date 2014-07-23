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





