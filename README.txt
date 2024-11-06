ACTORS QUEST

Application for researching actors and actresses in the 'themoviedb' database.

https://www.themoviedb.org/


Configuring the API call 

- Create an env.js file to save the parameters required for the queries.
- In this file, create the following lines: 

    export const API_TOKEN = ‘1234’;
    export const API_URL = ‘https://api.themoviedb.org/3/search’;
    export const API_OPTIONS = ‘&include_adult=false&language=en-US&page=1’;

- Replace the API_TOKEN value with your own token.
- Save and keep this file for local use only.
