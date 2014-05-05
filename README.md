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



# Etendre le plugin

## Créer son propre manager

TODO

## Ajouter un système de recherche

TODO


## Ajouter un filtre

TODO


## Ajouter un outil de téléchargement

TODO


## Ajouter un lecteur

TODO



# A faire

- Rendre les fichiers téléchargés par vuze accessible sur le réseau pour une lecture à distance (en cours)
- Faire des recherches sur The Pirate Bay
- Faire des recherches de sous-titres correspondant à un film ou épisode de série
- Pouvoir combiner les recherches (exemple : rechercher sur Cpasbien, si non trouvé alors rechercher sur The Pirate Bay)
- Ajouter un AskFilter (filtre qui utilise SARAH pour demander si le fichier doit être téléchargé ou non)
- Pouvoir lire sur n'importe quel player DLNA

