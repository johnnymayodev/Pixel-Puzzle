const log = console.log; // shortcut for console.log

var guess = ""; // the user's guess
var correct_guesses = 0;
var wrong_guesses = 0; // the number of wrong guesses the user has made

function initGame() {
  const startTime = new Date().getTime();

  // get the elements from the DOM
  const hintsContainer = document.getElementById("hints-container");
  const img = document.getElementById("image");

  // set the global variables
  globalThis.startTime = startTime;
  globalThis.hintsContainer = hintsContainer;
  globalThis.img = img;

  // listen for the user to submit a guess
  // this will be changed to always listen for key presses and enter will submit the guess
  document.getElementById("submit").addEventListener("click", function () {
    // only send the guess if the user has entered something
    if (document.getElementById("name").value !== "") {
      guess = document.getElementById("name").value;
      send_guess(guess);
    }
  });
}

function send_guess(guess) {
    fetch("/guess/" + guess)
      .then((response) => response.text())
      .then((data) => {
        log("Response from server: " + data);
        check_guess(data)
      });
}

function check_guess(response) {
    if (response === "CORRECT") {
      const endTime = new Date().getTime();
  
      // stop the player from guessing
      document.getElementById("submit").disabled = true;
  
      // calculate time taken to get the correct answer
      const time = (endTime - startTime) / 1000;
  
      // make image the original image
      img.src = `static/imgs/${the_object.imgs[0]}`;
  
      log(`You guessed correctly in ${time} seconds with ${wrong_guesses} wrong guesses`);
      correct_guesses++;
    } 
    else {
      // the guess was wrong
      wrong_guesses++;
      log("Wrong guess " + wrong_guesses);
      // hasn't been made clear if after 6 incorrect guesses the game ends,
      // if the another image is loaded, or the picture stays until the user
      // makes a correct guess
      if (wrong_guesses === 6) {
        //log("You failed");
        //document.getElementById("submit").disabled = true; // stop the player from guessing
      }
    }
  }

// get the object from the file and run the game
// need to get the name of the json from the server
fetch("static/json/apple.json")
.then((response) => response.json())
.then((data) => {
  globalThis.the_object = data;
  log(the_object);
})
.then((data) => {
  initGame();
  return data;
});