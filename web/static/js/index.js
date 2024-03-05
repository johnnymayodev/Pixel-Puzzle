const log = console.log; // shortcut for console.log
log("Hello, world!");

var guess = ""; // the user's guess
var wrong_guesses = 0; // the number of wrong guesses the user has made

function initGame() {
  const startTime = new Date().getTime();
  const hintsContainer = document.getElementById("hints-container");
  const img = document.getElementById("image");

  globalThis.startTime = startTime;
  globalThis.hintsContainer = hintsContainer;
  globalThis.img = img;

  document.getElementById("submit").addEventListener("click", function () {
    if (document.getElementById("name").value !== "") {
      log("Button clicked");
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
      check_guess(data);
    });
}

function check_guess(response) {
  if (response === "CORRECT") {
    const endTime = new Date().getTime();
    document.getElementById("submit").disabled = true; // stop the player from guessing
    const time = (endTime - startTime) / 1000;
    img.src = `static/imgs/${the_object.imgs[0]}`;
    log(`You guessed correctly in ${time} seconds`);
  } else {
    log("Wrong guess");
    wrong_guesses++;
    log(wrong_guesses);

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

    if (wrong_guesses === 6) {
      // fail?
      log("You failed");
      document.getElementById("submit").disabled = true; // stop the player from guessing
    }
  }
}

// get the object from the json
// path: ../json/object.json
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
