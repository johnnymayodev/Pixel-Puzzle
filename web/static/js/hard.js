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
const shareBtn = document.getElementById("share");
const helpBtn = document.getElementById("help");

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

  if (guesses.includes(enteredGuess)) {
    alert("You already guessed that!");
    return;
  }

  guesses.push(enteredGuess);

  if (globalThis.answer.includes(enteredGuess)) {
    const endTime = new Date().getTime();
    time = (endTime - globalThis.startTime) / 1000;

    game_over = true;

    var score = calculateScore(time, wrong_guesses, enteredGuess);
    globalThis.score = score;

    inputElem.hidden = true;
    imgElem.src = "../static/imgs/obj.jpg";
    imgElem.style.height = "200px";
    hintsElem.innerText = `You guessed the word ${answer[0].toUpperCase()}\nin ${time} seconds!`;
    hintsElem.innerText += `\nYour score is ${score}`;
    shareBtn.hidden = false;

    // set a cookie that expires at the end of the day
    // cookie is used to track if the user played the game today
    document.cookie = `played=true; expires=${new Date().setHours(
      23,
      59,
      59,
      0
    )}`;

    return;
  }

  guess = "";
  inputElem.innerText = guess;

  wrong_guesses++;

  switch (wrong_guesses) {
    case 1:
      break;
    case 2:
      imgElem.src = "../static/imgs/obj_2.jpg";
      break;
    case 3:
      break;
    case 4:
      hintsElem.innerText =
        "Hint:\nIt's between " +
        (globalThis.answer[0].length - 2) +
        " and " +
        (globalThis.answer[0].length + 2) +
        " letters long";
      break;
    case 5:
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

  if (wrong_guesses === 0) globalThis.oneGuess = true;

  if (answer[0] === guess) {
    score *= 2;
    globalThis.rightWord = true;
  } // if the user got the most correct answer, double the score

  return score.toFixed(0);
}

shareBtn.addEventListener("click", () => {
  var message = `My Pixel Puzzle score is ${score} `;

  if (globalThis.rightWord) message += "🟣";
  if (globalThis.oneGuess) message += "🟢";

  message += "🔴\nPlay the game at https://pixelpuzzle.johnnymayo.com/";

  navigator.clipboard.writeText(message);
});

helpBtn.addEventListener("click", () => {
  alert(
    "Type the word you think is in the image.\n" +
      "Press Enter to submit your guess.\n\n" +
      "If you get it wrong 6 times, you lose.\n" +
      "Each wrong guess gives you a hint.\n\n" +
      "When sharing your score, 🟣 means you got the correct word,\n" +
      " 🟢 means you got it in one guess, and 🔴 means you beat it on hard mode."
  );
});
