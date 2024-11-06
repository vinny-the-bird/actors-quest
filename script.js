import { API_TOKEN } from "./env.js";
import { API_URL } from "./env.js";
import { API_OPTIONS } from "./env.js";
import { API_PROFILE_PHOTO } from "./env.js";

const researchInput = document.getElementById("researchInput");
const apiResults = document.getElementById("results");
const infoDisplayed = document.getElementById("display");

function searchPerson() {
  apiResults.innerHTML = "";
  let inputToLowerCase = researchInput.value.toLowerCase();
  console.log(`Searching for : ${inputToLowerCase}`);

  fetch(`${API_URL}/person?query=${inputToLowerCase}${API_OPTIONS}`, options)
    .then((res) => res.json())
    // .then(res => console.log(res.results))
    // TODO: loop in res.results, then condition => display if department = "Acting"

    .then((res) => {
      for (let i = 0; i < res.results.length; i++) {
        let personProfile = document.createElement("div");
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
};
