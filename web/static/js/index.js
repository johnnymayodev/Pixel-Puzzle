console.log("JavaScript is loaded");
const log = console.log; // shortcut for console.log

var guess = ""; // the user's guess
var wrong_guesses = 0; // the number of wrong guesses the user has made
var time = 0; // the time it took for the user to guess the word
var game_over = false; // whether the game is over or not

// get the elements from the DOM
const imgElem = document.getElementById("image");
const inputElem = document.getElementById("input");
const hintsElem = document.getElementById("hints");

fetch("/api/cheat") // fetch the answer from the server to start the game
  .then((response) => response.text())
  .then((data) => {
    // make data a list
    data = data.split(",");
    log("Answers: ", data);
    globalThis.answer = data;
    initGame(); // * this is where the game starts
  });

/**
 *
 * @param {string} answer a list of words that are the possible answers (the first word is the most correct answer)
 * @returns {void}
 *
 * This function initializes the game by
 * * setting the start time
 * * creating an event listener for keydown events
 * * handling the user's input
 * * checking if the user's guess is correct
 *
 */
function initGame() {
  globalThis.startTime = new Date().getTime();

  document.addEventListener("keydown", function (event) {
    if (game_over) return; // if the game is over, return

    const key = event.key;

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

  if (globalThis.answer.includes(enteredGuess)) {
    const endTime = new Date().getTime();
    time = (endTime - globalThis.startTime) / 1000;

    game_over = true;

    var score = calculateScore(time, wrong_guesses, enteredGuess);

    imgElem.src = "../static/imgs/obj.jpg";
    hintsElem.innerText = `You guessed the word in ${time} seconds!`;
    hintsElem.innerText += `\nYour score is ${score}`;

    return;
  }

  guess = "";
  inputElem.innerText = guess;

  wrong_guesses++;

  switch (wrong_guesses) {
    case 1:
      imgElem.src = "../static/imgs/obj_2.jpg";
      break;
    case 2:
      imgElem.src = "../static/imgs/obj_3.jpg";
      break;
    case 3:
      hintsElem.innerText +=
        "\nHint: The word is " + globalThis.answer[0].length + " letters long";
      break;
    case 4:
      imgElem.src = "../static/imgs/obj_4.jpg";
      break;
    case 5:
      hintsElem.innerText +=
        "\nHint: The word starts with " + globalThis.answer[0][0];
      break;
    default:
      imgElem.src = "../static/imgs/obj.jpg";
      hintsElem.innerText =
        "Game Over!\nThe word was " + globalThis.answer[0].toUpperCase();
      game_over = true;
      break;
  }
}

function calculateScore(time, wrong_guesses, guess) {
  var score = 100;
  score -= wrong_guesses * 10;
  score -= Math.sqrt(2.5 * time);

  if (answer[0] === guess) score *= 2; // if the user got the most correct answer, double the score

  return score.toFixed(0);
}
