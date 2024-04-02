console.log("JavaScript is loaded");
const log = console.log; // shortcut for console.log

var guess = ""; // the user's guess
var wrong_guesses = 0; // the number of wrong guesses the user has made
var time = 0; // the time it took for the user to guess the word
var game_over = false; // whether the game is over or not
var guesses = []; // the user's guesses

// get the elements from the DOM
const imgElem = document.getElementById("image");
const inputElem = document.getElementById("input");
const hintsElem = document.getElementById("hints");
const helpBtn = document.getElementById("help");
const loadElem = document.getElementById("loading");
const gameDiv = document.getElementById("game");

fetch("/api/cheat/timed")
  .then((response) => response.text())
  .then((data) => {
    // make data a list
    data = data.split(",");
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].split("+");
    }
    log("Answers: ", data);
    globalThis.answers = data;
    initGame(); // * this is where the game starts
  });

function initGame() {
  // hide the loading element and show the game element
  loadElem.style.display = "none";
  gameDiv.style.display = "flex";

  // initialize global variables for the start of the game
  globalThis.startTime = new Date().getTime();
  globalThis.currentObject = 0;

  document.addEventListener("keydown", function (event) {
    if (game_over) return; // if the game is over, return

    const key = event.key;

    // if a mac user presses cmd + backspace, clear the input
    if (event.metaKey && key === "Backspace") {
      guess = "";
      inputElem.innerText = guess;
      return;
    }

    switch (key) {
      case "Backspace":
        if (guess.length === 0) return;
        guess = guess.slice(0, -1);
        break;

      case "Enter":
        if (guess.length === 0) return;
        handleGuess(guess);

      case key.match(/[a-zA-Z ]/) && key: // if the key is a letter or space
        if (key.length > 1) return;
        guess += key;
        break;

      default:
        return;
    }

    inputElem.innerText = guess.toUpperCase(); // update the input element
  });
}

function handleGuess(enteredGuess) {
  enteredGuess = enteredGuess.toLowerCase();

  if (guesses.includes(enteredGuess)) {
    guess = "";
    inputElem.innerText = guess;
    alert("You already guessed that!");
    return;
  }

  guesses.push(enteredGuess);

  const answer = answers[currentObject];
  if (answer.includes(enteredGuess)) {
    switch (currentObject) {
      case 0:
      case 1:
      case 2:
      case 3:
        guesses = [];
        wrong_guesses = 0;
        guess = "";
        inputElem.innerText = guess;

        currentObject++;
        imgElem.src = `../static/imgs/timed/${currentObject}_0.jpg`;

        break;
      default:
        const endTime = new Date().getTime();
        time = (endTime - globalThis.startTime) / 1000;

        game_over = true;

        gameDiv.innerHTML = `<h2>You finished in ${time} seconds!</h2>`;
        gameDiv.innerHTML += '<button id="share">Share Your Score</button>';
        const shareBtn = document.getElementById("share");
        shareBtn.addEventListener("click", () => {
          var message = `I finished Timed Mode in ${time} seconds!`;
          message += "\nPlay the game at https://pixelpuzzle.johnnymayo.com/";

          navigator.clipboard.writeText(message);
        });
    }
  } else {
    // if the guess is wrong
    wrong_guesses++;

    guess = "";
    inputElem.innerText = guess;

    switch (wrong_guesses) {
      case 1:
        imgElem.src = `../static/imgs/timed/${currentObject}_1.jpg`;
        break;
      case 2:
        imgElem.src = `../static/imgs/timed/${currentObject}_2.jpg`;
        break;
      case 3:
        hintsElem.innerText =
          "Hint:\nIt's " + answer[0].length + " letters long";
        break;
      case 4:
        imgElem.src = `../static/imgs/timed/${currentObject}_3.jpg`;
        break;
      case 5:
        hintsElem.innerText += "\nIt starts with " + answer[0][0].toUpperCase();
        break;
      default:
        // let the player keep guessing
        break;
    }
  }
}

helpBtn.addEventListener("click", () => {
  alert(
    "Type the word you think is in the image.\n" +
      "Press Enter to submit your guess.\n\n" +
      "In Timed Mode, you have to guess 5 images as fast as you can!\n\n" +
      "You have unlimited guesses per image.\n" +
      "Each wrong guess (up to 6) gives you a hint."
  );
});
