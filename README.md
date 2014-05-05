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

## Vous avez une Freebox Revolution

### Introduction

Vous pouvez utiliser votre freebox pour télécharger des films ou séries et les visionner une fois terminés avec le player de votre freebox.
Utilisez le manager nommé "rss-cpasbien-series+freeboxdl+freeboxairmedia" dans le fichier download.json. Ce manager recherche sur le site Cpasbien les nouvelles séries disponibles (flux RSS).
Il compare les entrées trouvées avec la liste que vous avez fournie dans le fichier download.json. Si une (ou plusieurs) correspondances sont trouvées, le manager va télécharger ces fichiers
en utilisant votre freebox. Une fois l'un des téléchargement terminé, SARAH vous propose de lire ce fichier.

### Autoriser l'application

Pour pouvoir piloter votre freebox, l'application SARAH doit être autorisée sur votre freebox. Au premier lancement, SARAH vous demande d'accepter l'application sur votre freebox en choisissant oui sur l'écran
LCD de votre freebox.

### Choisir vos séries

Pour indiquer à SARAH la liste des séries que vous souhaitez visionner, il suffit d'éditer le fichier download.json et modifier le tableau nommé list. Chaque entrée du tableau est un objet qui contient les informations suivantes :
- regexp (obligatoire) : une expression régulière permettant de filtrer les résultats fournis par le flux RSS de Cpasbien
- directory (optionnel) : le dossier dans lequel le fichier sera téléchargé dans votre freebox

### Lancer la recherche

Il vous suffit de dire "SARAH lance mes téléchargements"


## Pas de Freebox

### Mise en place

Si vous ne possédez pas de freebox et que vous voulez tester le plugin, alors il suffit de remplacer le contenu du fichier download.json par celui de download.back.json.
Vous remplacez alors l'utilisation de la freebox par l'utilisation de Vuze pour télécharger et VLC pour visualiser.
Vous n'avez pas besoin d'installer Vuze sur votre PC (par contre, il faut Java). J'utilise une version console de Vuze embarquée directement dans le plugin.
Vous devez par contre installer VLC si ce n'est pas déjà le cas (utilisez le chemin par défaut pour le moment).

### Choisir vos séries

Pour indiquer à SARAH la liste des séries que vous souhaitez visionner, il suffit d'éditer le fichier download.json et modifier le tableau nommé list. Chaque entrée du tableau est un objet qui contient les informations suivantes :
- regexp (obligatoire) : une expression régulière permettant de filtrer les résultats fournis par le flux RSS de Cpasbien

### Lancer la recherche

Il vous suffit de dire "SARAH lance mes téléchargements"





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
- Détection automatique de l'environnement (freebox ou pas, vlc dispo, ...) et adaptation automatique
- Télécharger des fchiers NZB
