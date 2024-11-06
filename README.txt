ACTORS QUEST

Application de recherche d'acteurs et d'actrice sur la base de données themoviedb

https://www.themoviedb.org/


Configuration de l'appel API 

- Créer un fichier env.js afin de passer les paramètres nécessaires aux requêtes.
- Dans ce fichier, créer les lignes suivantes : 

    export const API_TOKEN = "1234";
    export const API_URL = "https://api.themoviedb.org/3/search";
    export const API_OPTIONS = "&include_adult=false&language=en-US&page=1";

- remplacer la valeur de API_TOKEN par votre propre token.
- sauvegarder et conserver ce fichier uniquement pour votre utilisation en local.

