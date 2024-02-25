const log = console.log; // shortcut for console.log

var guess = ""; // the user's guess
var wrong_guesses = 0; // the number of wrong guesses the user has made

fetch("/get_image_url")
  .then((response) => response.json())
  .then((data) => {
    globalThis.the_object = data;
    initGame();
  });


function initGame() {

  log("The object is: ", the_object);

  const startTime = new Date().getTime();
  const hintsContainer = document.getElementById("hints-container");
  const img = document.getElementById("image");

  globalThis.startTime = startTime;
  globalThis.hintsContainer = hintsContainer;
  globalThis.img = img;
  
  img.src = the_object.image_url;
  img.style.width = "300px";

  document.getElementById("submit").addEventListener("click", function () {
    if (document.getElementById("name").value !== "") {
      guess = document.getElementById("name").value;
      send_guess(guess);
    }
  });

}





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

function add_hint(hint){
    let display =``;
    switch (hint){
        case "firstLetter":
            display = `<h3>The first letter is ${the_object.name[0]}</h3>`;
            break;
        case "category":
            display = `<p>The category is ${the_object.category}</p>`;
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
    img.src = `static/imgs/${the_object.imgs[0]}`;
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
      console.log(`Hint: ${the_object.category}`);
    }

    if (wrong_guesses === 4) {
      // make image less blurry and give first letter hint
      add_hint("firstLetter");
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