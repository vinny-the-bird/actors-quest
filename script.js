import { API_TOKEN, API_URL } from "./env.js";

const API_OPTIONS = "&include_adult=false&language=en-US&page=1";
const API_PROFILE_PHOTO = "https://image.tmdb.org/t/p/w45"

const researchInput = document.getElementById("researchInput");
const apiResults = document.getElementById("results");
const infoDisplayed = document.getElementById("display");

function searchPerson() {
  apiResults.innerHTML = "";
  let inputToLowerCase = researchInput.value.toLowerCase();

  fetch(`${API_URL}/3/search/person?query=${inputToLowerCase}${API_OPTIONS}`, options)
    .then((res) => res.json())
    // .then(res => console.log(res.results))
    // TODO: loop in res.results, then condition => display if department = "Acting"

    .then((res) => {
      if (res.results.length == 0) {
        apiResults.innerText = "Aucun résultat trouvé pour votre recherche.";
      }

      for (let i = 0; i < res.results.length; i++) {
        let personProfile = document.createElement("div");
        personProfile.setAttribute("href", "www.google.com");
        personProfile.setAttribute("id", `${res.results[i].id}`);
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
        
        personProfile.addEventListener("click", (event) => {
          event.preventDefault();
          // let profileBlock = document.getElementsByClassName("profile");
          // console.log(`details from person id ${res.results[i].id}`);
          
          displayPersonDetails();
          // profileBlock.addEventListener("click", displayPersonDetails);
        });

        function displayPersonDetails(){
          let personId = res.results[i].id;
          console.log("🚀 ~ displayPersonDetails ~ personId:", personId);
        }
      }
    })
    .catch((err) => console.error(err));
}

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


export default {
  capitalizeFirstLetter,
  searchPerson,
  // displayPersonDetails,
};
