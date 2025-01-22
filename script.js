import { API_TOKEN, API_URL } from "./env.js";

const API_OPTIONS = "&include_adult=false&language=en-US&page=1";
const API_PROFILE_PHOTO = "https://image.tmdb.org/t/p/w45";
const API_INFO_PHOTO = "https://image.tmdb.org/t/p/w185";

const researchInput = document.getElementById("researchInput");
const apiResults = document.getElementById("results");
const infoDisplayed = document.getElementById("information");
const moviesResults = document.getElementById("filmography");
const historyList = document.getElementById("history");
const favoritesList = document.getElementById("favorites");

const whiteHeart = "\u2661";
const blackHeart = "\u2665";
let favoritesArray = []; // call local storage array here ?

if (localStorage.getItem("favorites") === null || "") {
  localStorage.setItem("favorites", JSON.stringify([]));
}

const favoritesSaved = localStorage.getItem("favorites");
console.log("🚀 ~ favoritesSaved:", favoritesSaved)

const favoritesParsed = JSON.parse(favoritesSaved);
console.log("🚀 ~ favoritesParsed:", favoritesParsed)

favoritesArray = favoritesParsed;
console.log("🚀 ~ favoritesArray:", favoritesArray)



// TODO: search in both crew & cast. Fix for only cast
function searchPerson() {
  apiResults.innerHTML = "";
  let inputToLowerCase = researchInput.value.toLowerCase();

  fetch(
    `${API_URL}/3/search/person?query=${inputToLowerCase}${API_OPTIONS}`,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.results.length == 0) {
        apiResults.innerText = "Aucun résultat trouvé pour votre recherche.";
        return;
      }

      for (let i = 0; i < res.results.length; i++) {
        let personProfile = document.createElement("div");
        let personId = res.results[i].id;

        personProfile.setAttribute("id", `${personId}`);
        personProfile.setAttribute("class", "profile");
        let personName = document.createElement("h4");
        personName.innerText = res.results[i].name;
        let personPhoto = document.createElement("img");

        if (!res.results[i].profile_path) {
          personPhoto.setAttribute("src", "media/empty_profile_photo_thin.jpg");
          personPhoto.setAttribute("width", "45px");
        } else {
          personPhoto.setAttribute(
            "src",
            `${API_PROFILE_PHOTO}${res.results[i].profile_path}`
          );
          personPhoto.setAttribute("alt", `${res.results[i].name}`);
        }

        personProfile.appendChild(personPhoto);
        personProfile.appendChild(personName);
        apiResults.appendChild(personProfile);

        personProfile.addEventListener("click", () => {
          let currentlyActive = document.querySelector(".active");
          if (currentlyActive) {
            currentlyActive.classList.remove("active");
          }

          personProfile.classList.add("active");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          displayPersonInfo(personId);
          displayActorMovies(personId);
          updateActorHistory(personId);
        });
      }
    })
    .catch((err) => console.error(err));
}

function displayPersonInfo(id) {
  console.log("clicked displayPersonInfo : ", id);
  infoDisplayed.innerHTML = "";
  fetch(`${API_URL}/3/person/${id}`, options)
    .then((res) => res.json())

    .then((res) => {
      let infoName = document.createElement("h3");
      infoName.innerText = `${res.name}`;

      let infoPhoto = document.createElement("img");

      if (!res.profile_path) {
        infoPhoto.setAttribute("src", "media/empty_profile_photo_thin.jpg");
        infoPhoto.setAttribute("width", "185px");
      } else {
        infoPhoto.setAttribute("src", `${API_INFO_PHOTO}${res.profile_path}`);
        infoPhoto.setAttribute("alt", `${res.name}`);
      }

      let favoriteBtn = document.createElement("button");

      favoriteBtn.textContent = "♡";
      favoriteBtn.classList.add("heartButton");
      favoriteBtn.addEventListener("click", () => {
        toggleFavorite(favoriteBtn, id);
      });

      if (favoritesArray.includes(id)) {
        toggleFavorite(favoriteBtn, id)
      }

      let infoBirthday = document.createElement("p");
      infoBirthday.innerText = `Naissance : ${res.birthday}`;

      let infoDeathday = document.createElement("p");
      infoDeathday.innerText = `Décès : ${res.deathday}`;

      let infoBirthplace = document.createElement("p");
      infoBirthplace.innerText = `Lieu de naissance : ${res.place_of_birth}`;

      let infoGender = document.createElement("p");
      let genderName;
      switch (res.gender) {
        case 0:
          genderName = "N/A";
          break;
        case 1:
          genderName = "Femme";
          break;
        case 2:
          genderName = "Homme";
          break;
        case 3:
          genderName = "Non-binaire";
          break;
      }

      infoGender.innerText = `Genre : ${genderName}`;

      let infoAKA = null;
      if (!res.also_known_as.length == 0) {
        infoAKA = document.createElement("p");
        infoAKA.innerText = `Autres noms : ${res.also_known_as}`;
      }

      let infoBiography = document.createElement("p");
      infoBiography.innerText = `Biographie : ${res.biography}`;

      infoDisplayed.appendChild(infoName);
      infoDisplayed.appendChild(infoPhoto);
      infoDisplayed.appendChild(favoriteBtn);

      if (res.birthday) {
        infoDisplayed.appendChild(infoBirthday);
      }

      if (res.place_of_birth) {
        infoDisplayed.appendChild(infoBirthplace);
      }

      if (res.deathday) {
        infoDisplayed.appendChild(infoDeathday);
      }

      infoDisplayed.appendChild(infoGender);

      if (infoAKA) {
        infoDisplayed.appendChild(infoAKA);
      }

      infoDisplayed.appendChild(infoBiography);
    })

    .catch((err) => console.error(err));
}

function displayActorMovies(id) {
  moviesResults.innerHTML = "";

  fetch(`${API_URL}/3/person/${id}/movie_credits`, options)
    .then((res) => res.json())
    .then((res) => {
      for (let i = 0; i < res.cast.length; i++) {
        let movieList = document.createElement("div");
        let movieTitle = document.createElement("li");

        movieTitle.innerText = res.cast[i].original_title;
        let movieId = res.cast[i].id;

        movieList.appendChild(movieTitle);
        moviesResults.appendChild(movieList);

        movieTitle.addEventListener("click", () => {
          searchActorsByMovie(movieId);
        });
      }
    })
    .catch((err) => console.error(err));
}

// TODO: duplicate code: build function to display actors in searchPerson()
// and searchActorsByMovie(), changing variable by "results" or "cast"
// depending which function call
function searchActorsByMovie(id) {
  apiResults.innerHTML = "";

  fetch(`${API_URL}/3/movie/${id}/credits`, options)
    .then((res) => res.json())
    .then((res) => {
      if (res.cast.length == 0) {
        apiResults.innerText = "Aucun résultat trouvé pour votre recherche.";
        return;
      }

      for (let i = 0; i < res.cast.length; i++) {
        let personProfile = document.createElement("div");
        let personId = res.cast[i].id;

        personProfile.setAttribute("id", `${personId}`);
        personProfile.setAttribute("class", "profile");
        let personName = document.createElement("h4");
        personName.innerText = res.cast[i].name;
        let personPhoto = document.createElement("img");

        if (!res.cast[i].profile_path) {
          personPhoto.setAttribute("src", "media/empty_profile_photo_thin.jpg");
          personPhoto.setAttribute("width", "45px");
        } else {
          personPhoto.setAttribute(
            "src",
            `${API_PROFILE_PHOTO}${res.cast[i].profile_path}`
          );
          personPhoto.setAttribute("alt", `${res.cast[i].name}`);
        }

        personProfile.appendChild(personPhoto);
        personProfile.appendChild(personName);
        apiResults.appendChild(personProfile);

        personProfile.addEventListener("click", () => {
          let currentlyActive = document.querySelector(".active");
          if (currentlyActive) {
            currentlyActive.classList.remove("active");
          }

          personProfile.classList.add("active");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          displayPersonInfo(personId);
          displayActorMovies(personId);
          updateActorHistory(personId);
        });
      }
    })
    .catch((err) => console.error(err));
}

async function updateActorHistory(id) {
  await fetch(`${API_URL}/3/person/${id}`, options)
    .then((res) => res.json())
    .then((res) => {
      let actorName = res.name;

      let history = JSON.parse(sessionStorage.getItem("actorHistory")) || [];
      history = [
        { id, name: actorName },
        ...history.filter((actor) => actor.id !== id),
      ];
      if (history.length > 3) {
        history.pop();
      }

      sessionStorage.setItem("actorHistory", JSON.stringify(history));
      displayActorHistory();
    })
    .catch((err) => console.error(err));
}

function displayActorHistory() {
  const history = JSON.parse(sessionStorage.getItem("actorHistory")) || [];

  historyList.innerHTML = "";

  history.forEach(({ id, name }) => {
    const button2 = document.createElement("button");
    button2.innerHTML = `<a id="${id}" href="#">${name}</a>`;

    button2.addEventListener("click", () => {
      displayPersonInfo(id);
      apiResults.innerHTML = "";
    });

    historyList.appendChild(button2);
  });
}


  // ==== WIP FAVORITES ==== 

// function displayActorFavorites() {
//   const myFavorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
//   console.log("== access displayActorFavorites ==")
//   console.log("🚀 ~ displayActorFavorites ~ myFavorites:", myFavorites)

//   // myFavorites.innerHTML = "";

//   myFavorites.forEach(({ id, name }) => {
//     const button3 = document.createElement("button");
//     button3.innerHTML = `<a id="${id}" href="#">${name}</a>`;

//     button3.addEventListener("click", () => {
//       displayPersonInfo(id);
//       apiResults.innerHTML = "";
//     });

//     favoritesList.appendChild(button3);
//   });
// }


function capitalizeFirstLetter(word) {
  wordFirstLetterCap = word.charAt(0).toUpperCase() + word.slice(1);
  return wordFirstLetterCap;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("searchButton");
  button.addEventListener("click", searchPerson);
});

// TODO: display favorites as button in sidepage
function toggleFavorite(button, id) {
  if (button.textContent === whiteHeart) {
    button.textContent = blackHeart;
    if (!favoritesArray.includes(id)) {
      favoritesArray.push(id);
      console.log("Adding to favs: ", id)
    }
  } else {
    button.textContent = whiteHeart;
    const index = favoritesArray.indexOf(id);
    const itemToRemove = favoritesArray.splice(index, 1);
    console.log("Removing from favs: ", id)

  }

  const stringifiedFavorites = JSON.stringify(favoritesArray);
  localStorage.setItem("favorites", stringifiedFavorites);
  console.log("update fav array = ", favoritesArray)
}

window.onload = function () {
  displayActorHistory();
  // displayActorFavorites();
};

export default {
  capitalizeFirstLetter,
  searchPerson,
};
