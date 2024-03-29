const log = console.log; // shortcut for console.log

var guess = ""; // the user's guess
var correct_guesses = 0;
var wrong_guesses = 0; // the number of wrong guesses the user has made

function initGame() {
    const startTime = new Date().getTime(); // may remove this
  
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
    // send the guess to the server
    // the response will either be "CORRECT" or "WRONG"
    fetch("/guess/" + guess)
      .then((response) => response.text())
      .then((data) => {
        log("Response from server: " + data);
        check_guess(data);
      });
  }
  
  function check_guess(response) {
    if (response === "CORRECT") {
      const endTime = new Date().getTime();
  
      // stop the player from guessing
      //document.getElementById("submit").disabled = true;
  
      // calculate time taken to get the correct answer
      const time = (endTime - startTime) / 1000;
  
      // make image the original image
      img.src = `static/imgs/${the_object.imgs[0]}`;
  
      log(`You guessed correctly in ${time} seconds`);
      correct_guesses++;
      wrong_guesses = 0;
      // code for fetching next image goes here
      // my guess is to take elements from initGame 
      // to get the next image or simply the call 
      // function itself
    } else {
      // the guess was wrong
      wrong_guesses++;
      log("Wrong guess " + wrong_guesses);
  
      // if the player makes 1 wrong guess, don't do anything
  
      if (wrong_guesses === 2) {
        // make image less blurry
        img.src = `static/imgs/${the_object.imgs[2]}`;
        log("Making image less blurry");
      }
  
      if (wrong_guesses === 3) {
        // add color to image
        img.src = `static/imgs/${the_object.imgs[3]}`;
        log("Adding color to image");
      }
  
      if (wrong_guesses === 4) {
        // give category hint
        log(`Hint: ${the_object.category}`);
      }
  
      if (wrong_guesses === 5) {
        // make image less blurry and give first letter hint
        img.src = `static/imgs/${the_object.imgs[4]}`;
        log("Making image less blurry");
      }
  
      // if the player makes 6 wrong guesses, the next i,age
      // is displayed
      if (wrong_guesses === 6) {
        log("Next image");
        // code for fetching next image goes here
        // my guess is to take elements from initGame 
        // to get the next image or simply the call 
        // function itself, for incorrect guesses
        // the counter needs to be reset back to 0
        wrong_guesses = 0;
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