import OBJECTS_DATA from './objects.js';
const OBJECTS_JSON = JSON.parse(OBJECTS_DATA);

const startTime = new Date().getTime();

var guess = "";
var wrong_guesses = 0;

function send_guess(guess) {
  fetch("/guess/" + guess)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      console.log("Response from server: " + data);
      check_guess(data);
    });
}
const hintsContainer = document.getElementById("hints-container");
function add_hint(hint){
    let display =``;
    const object = OBJECTS_JSON[0];
    switch (hint){
        case "firstLetter":
            display = `<h3>${object.name[0]}</h3>`;
            break;
        case "category":
            display = `<p>${object.category}</p>`;
            break;
        default:
            break;
    }

    let card = document.createElement("div");
    card.innerHTML = display;

    card.classList.add("hint-card");

    hintsContainer.appendChild(card);
  }

function check_guess(guess) {
  if (guess === "CORRECT") {
    const endTime = new Date().getTime();
    document.getElementById("submit").disabled = true; // stop the player from guessing
    const time = (endTime - startTime) / 1000;
    console.log(`You guessed correctly in ${time} seconds`);
  } else {
    console.log("Wrong guess");
    wrong_guesses++;
    console.log(wrong_guesses);

    if (wrong_guesses === 2) {
      // add color to image
      console.log("Adding color to image");
    }

    if (wrong_guesses === 3) {
      // give category hint
      add_hint("category");
      console.log("Hint: This is a fruit");
    }

    if (wrong_guesses === 4) {
      // make image less blurry
      console.log("Making image less blurry");
    }

    if (wrong_guesses === 5) {
      // make image less blurry
      console.log("Making image less blurry");
    }

    if (wrong_guesses === 6) {
      // fail?
      console.log("You failed");
      document.getElementById("submit").disabled = true; // stop the player from guessing
    }

  }
}

document.getElementById("submit").addEventListener("click", function () {
  if (document.getElementById("name").value !== "") {
    guess = document.getElementById("name").value;
    send_guess(guess);
  }
});