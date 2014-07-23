# Utilisation

## Choisir vos séries

Pour indiquer à SARAH la liste des séries que vous souhaitez visionner, il suffit d'éditer le fichier download.json et modifier le tableau nommé list. Chaque entrée du tableau est un objet qui contient les informations suivantes :
- regexp (obligatoire) : une expression régulière permettant de filtrer les résultats de la recherche
- directory (optionnel seulement pour les utilisateurs ayant une freebox) : le dossier dans lequel le fichier sera téléchargé dans votre freebox

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


## Recherche automatique

Le plugin est configuré pour lancer les recherches de séries de manière automatique. Si SARAH trouve un nouvel épisode, celui-ci sera téléchargé de manière automatique. Une fois le téléchargement terminé, le plugin se met en attente. Si une présence est détectée, SARAH vous propose de lire l'épisode précédemment téléchargé.

L'intérêt est que le téléchargement se fasse dès qu'un nouvel épisode est disponible même si vous n'êtes pas chez vous (par exemple lorsque vous êtes au travail). Lorsque vous rentrez chez vous, une présence est détectée et SARAH vous demande si vous voulez regarder l'épisode qu'elle a téléchargé en votre absence.


## Demander à SARAH de lancer la recherche des séries

Il vous suffit de dire "SARAH télécharge mes séries". SARAH téléchargera automatiquement toutes les séries fournies dans le fichier download.json qui n'ont pas déjà été téléchargées. Une fois un épisode téléchargé, SARAH vous demande si vous souhaitez le visionner. Si vous acceptez, SARAH lancera la lecture de l'épisode.


## Demander à SARAH de lancer la recherche des films

Il vous suffit de dire "SARAH télécharge des films". SARAH va chercher la liste des films récemment ajoutés. Pour chaque nouveau film trouvé, elle vous propose de le télécharger.
A vous d'accepter ou refuser vocalement le téléchargement.

## Auto-détection

Le plugin est capable de scanner votre environnement pour savoir ce qui est disponible chez vous. Pour le moment, le plugin va vérifier si vous possédez une Freebox et l'utiliser si présente.
Sinon, il va tester la présence de Java et de VLC sur le PC où est installé SARAH. Si c'est le cas, alors le téléchargement se fera en local en utilisant Vuze et la lecture se fera avec VLC.

## Vous avez une Freebox ?

Pour pouvoir utiliser votre Freebox, le plugin doit être autorisé par la Freebox en [suivant les indications de cette page](https://github.com/aurelien-baudet/SARAH-magicdl/wiki/Vous-avez-une-Freebox-%3F)