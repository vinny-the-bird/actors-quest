import { API_TOKEN } from './env.js';
import { API_URL } from './env.js';
import { API_OPTIONS } from './env.js';

const researchInput = document.getElementById("researchInput");
const apiResults = document.getElementById("results");
const infoDisplayed = document.getElementById("display");

    // for testing purpose
function getInput() {
  let inputToLowerCase = researchInput.value.toLowerCase();
  console.log("🚀 ~ getInput ~ inputToLowerCase:", inputToLowerCase);

  apiResults.innerHTML = "here are api call's results";
  infoDisplayed.innerHTML = "here are person's data";
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

function searchPerson() {
  let inputToLowerCase = researchInput.value.toLowerCase();
  console.log(`Searching for : ${inputToLowerCase}`);

  fetch(
    `${API_URL}/person?query=${inputToLowerCase}${API_OPTIONS}`,
    options
  )
    .then((res) => res.json())
    // .then(res => console.log(res.results))
    // TODO: loop in res.results, then condition => display if department = "Acting"
    .then((res) => console.log(res.results))
    .catch((err) => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("searchButton");
  button.addEventListener("click", searchPerson);
});

export default {
  getInput,
  capitalizeFirstLetter,
  searchPerson,
};
