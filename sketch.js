// machine learning variables. Taken from example.

let classifier;
const options = { probabilityThreshold: 0.75 };
let label;
let confidence;
let currentScreen = "Start";

let word;
let arrowPosition = 0;
let wordCount = 0;

let choosingPage = false;

// api variables

var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/",
};

// button array
var buttonArrayStart = [];
var buttonArrayStartpage = [];

var generalButtons = [];
let upButton;
let downButton;
let backButton;

var buttonArrayDataSelection = [];
var buttonArrayCharacters = [];
var buttonArrayEpisodes = [];
var buttonArrayFamilies = [];
var buttonArrayLocations = [];

var currentButtons = [];


function preload() {
  classifier = ml5.soundClassifier('SpeechCommands18w', options); // taken from example

}



function setup() {
  createCanvas(600, 600);
  label = createDiv('Label: ...'); // taken from example
  confidence = createDiv('Confidence: ...'); // taken from example
  classifier.classify(gotResult); // taken from example
  var i = 0;

  buttonArrayStart.push(new Btn(60 + (i * 75), 10, 70, 25, i));



  upButton = new Btn(10, 225, 100, 40, "Up");
  downButton = new Btn(10, 275, 100, 40, "Down");

  backButton = new Btn(10, 550, 100, 40, "Back");


  generalButtons.push(upButton);
  generalButtons.push(downButton);
  generalButtons.push(backButton);
  
}

// counter is to check if a character has already been selected
var counter = 0;

function draw() {
  switch (currentScreen) {
    case "Start":
      startPage();
      break;
  
    case "data_page":
      drawTraits();
      break;

    case "data_selection":
      dataSelectionPage();
      break;
  }

  for(var i = 0; i < currentButtons.length; i++) {
    currentButtons[i].drawButton();
  }

  for(var i = 0; i < generalButtons.length; i++) { // draw up and down button
    generalButtons[i].drawButton();
  }

  if (upButton.isPressed) { // logic for up button
    moveArrow("up");
  }

  if (downButton.isPressed) { // logic for down button
    moveArrow("down");
  } 

  fill(125);

  drawIndexes();

  drawArrow();

  if (choosingPage) {
    fill(250,0,0);
    rect(150, 250, 300, 100);
    fill(0);
    textSize(19);
    text("Do you want to access this page?", 155, 285);
    text("Say \"yes\" to enter, \"no\" to reselect", 155, 315);
    
  }
}

function drawTraits() {
  background(200);
  for (i = 0; i < currentButtons.length; i++) {
    currentButtons[i].drawButton();
    if (currentButtons[i].isOn && counter == 0) {

      counter++;
      currentResource = [];

      while (typeof currentResource === 'undefined') { // if the character somehow is undefined, run the same line until it is not
        currentResource = [];
      }

    } else if (!currentButtons[i].isOn) {
      counter = 0; // reset button
    }
    
  }

  if (word == "up") {
    fill(255, 160, 90);
  } else {
    fill(100,255,167);
  }
  rect(125, 100, 400, 400);
  textSize(20);
  fill(0);
  text("Traits: ", 200, 120);
  counter2 = 0; // counter for the items in the current resource


}


function infoBox() {
  fill(230);
  rect(400, 300, 190, 250);
  fill(0);
  textSize(20);
  text("Info: how to use", 405, 325);

  textSize(15);
  text("In order to navigate through\nthe site; say \"up\" to move\nthe arrow one button up,\n\"down\" to move it one down.\nOr you can specify which\nbutton you want to use by\nsaying its number.\nThe numbering starts at 0.\nIf everything fails,\nthen there are buttons to\nhelp do the navigatation.", 405, 345);
}

function startPage() {
  background(200);
  fill(0);
  textSize(32);
  text("Welcome to our voice activated program.\nYou can use your voice to navigate.", 10, 25);
  
  infoBox();
  
  if (buttonArrayStartpage.length == 0) {
    var i = 0;
    buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Characters"));
    buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Episodes"));
    buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Families"));
    buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Locations"));
    currentButtons = buttonArrayStartpage;
  }
}

// A function to run when we get any errors and the results
function gotResult(error, results) { // from example
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  // Show the first label and confidence
  label.html('Label: ' + results[0].label);
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
  word = results[0].label;
  moveArrow(word); 
}

let timer;

function moveArrow(newWord) {
  if (word == newWord) {
    if (timer + 500 > millis()) {
      return;
    }
  }
  word = newWord;

  timer = millis();


  if (word == "go") {
    choosingPage = true;
  } 

  if (choosingPage) {
      if (word == "yes") {
        arrowPosition = 0;
        if (currentScreen == "Start") {
          currentScreen = "data_selection";
        } else if (currentScreen == "data_selection") {
          currentScreen = "data_page";
          currentButtons = [];
        }
        choosingPage = false;
    } else if (word == "no") {
        choosingPage = false;
    }
    return;
  }


  if (word == "down") {
    if (arrowPosition < currentButtons.length - 1 && arrowPosition >= 0) {
      arrowPosition++;
    } else if (arrowPosition == currentButtons.length - 1) {
      arrowPosition = 0;
    }
  } else if (word == "up") {
    if (arrowPosition > 0 && arrowPosition <= currentButtons.length - 1) {
      arrowPosition--;
    } else if (arrowPosition == 0) {
      arrowPosition = currentButtons.length - 1;
    }
  } 
  
  


if (word == "zero") {
  updateArrowPosition(0);
} else if (word == "one") {
  updateArrowPosition(1);

} else if (word == "two") {
  updateArrowPosition(2);

} else if (word == "three") {
  updateArrowPosition(3);

} else if (word == "four") {
  updateArrowPosition(4);

} else if (word == "five") {
  updateArrowPosition(5);

} else if (word == "six") {
  updateArrowPosition(6);

} else if (word == "seven") {
  updateArrowPosition(7);

} else if (word == "eight") {
  updateArrowPosition(8);

} else if (word == "nine") {
  updateArrowPosition(9);

}
  word = null;
}

if (word == "left") {
  //
}

function updateArrowPosition(number) {

  if (number < currentButtons.length) {
    arrowPosition = number;
  }
}

function drawArrow() {
  if (typeof currentButtons[arrowPosition] != 'undefined' && arrowPosition < currentButtons.length) { // draw arrow for buttons

    let xPositionArrow = currentButtons[arrowPosition].getXPosition() + currentButtons[arrowPosition].getWidth() + 31;
    let yPositionArrow = currentButtons[arrowPosition].getYPosition() + currentButtons[arrowPosition].getHeight() - 19;
  
    fill(0);
    textSize(25);
    text("<", xPositionArrow, yPositionArrow);

    text("arrow pos: " + arrowPosition, 50, 400);
  }
}

function dataSelectionPage() {
  background(220);
  if (buttonArrayDataSelection.length == 0) {
    for (var i = 0; i < 10; i++) {
      buttonArrayDataSelection[i] = new Btn(width/2 - 50,10+(i*55),125,50, i)
    }
    currentButtons = buttonArrayDataSelection;

  }
}

function drawIndexes() {

  textSize(25);

  for (var i = 0; i < currentButtons.length; i++) {

    let xPosition = currentButtons[i].getXPosition() + currentButtons[i].getWidth() + 10;
    let yPosition = currentButtons[i].getYPosition() + currentButtons[i].getHeight()/1.5;

    text(i, xPosition, yPosition);    
  }

}
