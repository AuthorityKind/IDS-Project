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
let goBack = false;

// api variables
const api = "https://spapi.dev/api/";
const dataKeys = ["characters","episodes", "families", "locations"];
let targetData;

let characters;
let charactersKeys = [
  "id",
  "name",
  "age",
  "sex",
  "occupation",
  "religion",
  "family",
];

let locations;
let locationKeys = ["id", "name"];

let families;
let familiesKeys = ["id", "name", "characters"];

let episodes;
let episodeKeys = ["id", "name", "season", "episode", "air_date"];



let dataArray = [];


// button array
let buttonArrayStart = [];
let buttonArrayStartpage = [];

let generalButtons = [];
let upButton;
let downButton;
let backButton;

let buttonArrayDataSelection = [];
let buttonArrayCharacters = [];
let buttonArrayEpisodes = [];
let buttonArrayFamilies = [];
let buttonArrayLocations = [];

let currentButtons = [];
let lastScreen;


function preload() {
  classifier = ml5.soundClassifier('SpeechCommands18w', options); // taken from example

}


function setup() {
  createCanvas(600, 600);

  setupData();

  label = createDiv('Label: ...'); // taken from example
  confidence = createDiv('Confidence: ...'); // taken from example
  classifier.classify(gotResult); // taken from example
  let i = 0;

  buttonArrayStart.push(new Btn(60 + (i * 75), 10, 70, 25, i));



  upButton = new Btn(10, 225, 100, 40, "Up");
  downButton = new Btn(10, 275, 100, 40, "Down");

  backButton = new Btn(10, 550, 100, 40, "Back");


  generalButtons.push(upButton);
  generalButtons.push(downButton);
  generalButtons.push(backButton);
}

function setupData() {
  characters = new Data(api + "characters", charactersKeys);
  locations = new Data(api + "locations", locationKeys);
  families = new Data(api + "families", familiesKeys);
  episodes = new Data(api + "episodes", episodeKeys);
}

function load10(name, callback) {
  dataArray = [];
  let counter = 0;
  targetData = name;

  for (var i = 1; i <= 10; i++) {
    loadJSON(getDataCollection(targetData).url + "/" + i, function(json) {

      dataArray.push(json.data);
      counter++;
      if (counter === 10) {
        callback(dataArray);
      }
    });

  }
}


function loadSpecificData(name) {
  targetData = name;
  loadJSON(getDataCollection(targetData).url, loadData);
}

function loadData(json) {
  const realTotal = Number(json.meta["last_page"]);
  for (var i = 1; i <= realTotal; i++) {
    loadJSON(api + targetData + "?page=" + i, loadDataCluster);
  }
}

function loadDataCluster(json) {
  if (json != null && json != undefined) {
    for (var i = 0; i < Number(json.meta["per_page"]); i++) {
      const obj = json.data[i];
      getDataCollection(targetData).content.push(obj);
      var count = 0;
      while (count < 10000){
        count++;
      }
    }
  }
}

function getDataCollection(name) {
  switch (name) {
    case "characters":
      return characters;
    case "locations":
      return locations;
    case "families":
      return families;
    case "episodes":
      return episodes;
    default:
      return null;
  }
}

let currentIndex = 0;

// counter is to check if a character has already been selected
let counter = 0;

function draw() {


  for(var i = 0; i < 10; i++) {
    if (typeof dataArray[i] != 'undefined') {
      //console.log("loop outside " + dataArray[i]["name"]);
    }
  }



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
  if (goBack) {
    fill(250,0,0);
    rect(150, 250, 300, 100);
    fill(0);
    textSize(19);
    text("Do you want to go back?", 155, 285);
    text("Say \"yes\" to enter, \"no\" to stay", 155, 315);
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

  if (currentButtons.length == 0) {
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
  // Show the first label and confidence
  label.html('Label: ' + results[0].label);
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
  word = results[0].label;
  moveArrow(word); 
}

let timer;
let dataSelectionIndex;
let dataIndex;
let specificContent = [];

let resourceData = [];

function moveArrow() {

  // choosing to go back or not
  if (goBack) {
    if (word == "yes") {
        changeScreen("last");
        goBack = false;
    } else if (word == "no") {
        goBack = false;
    }
    return;
  }


  // if we are choosing a specific page
  if (choosingPage) {
    if (word == "yes") {
      if (currentScreen == "Start") {
        dataSelectionIndex = arrowPosition;
        currentIndex = dataSelectionIndex;

        load10(dataKeys[currentIndex], function(dataArray) {
        });




        changeScreen("data_selection");

      } else if (currentScreen == "data_selection") {
        dataIndex = arrowPosition;
        currentIndex = dataIndex;
        changeScreen("data_page");
      }
  choosingPage = false;
    
  } else if (word == "no"){
  choosingPage = false;
  }
  return;
}

// the last two if statements needs to be at the top, because we dont want to run the rest of the code if we go into them


  // go commands
  if (word == "go") {
    choosingPage = true;
  } 


  // navigation commands, up down
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

  // go back to last screen
  if (word == "no" && currentScreen != "start_page") {
    goBack = true;
    changeScreen("last");
  }

  // navigation commands, numbers
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

function changeScreen(newScreen) {

  if (newScreen == "last") {
    currentScreen = lastScreen
  } else {
    lastScreen = currentScreen;
    currentScreen = newScreen;
  }

  goBack = false;
  choosingPage = false;

  arrowPosition = 0;
  currentButtons = [];

}



function findData() {
  loadSpecificData(dataKeys[arrowPosition]);
  content = getDataCollection(dataKeys[arrowPosition]);
  return content.content;
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

let content;

function dataSelectionPage() {
  background(220);

  fill(12);
  textSize(32);
  text("page: " + dataKeys[currentIndex], 10, 50);


  if (typeof dataArray[9] != 'undefined' && buttonArrayDataSelection.length == 0) {
    for (var i = 0; i < 10; i++) {
        buttonArrayDataSelection[i] = new Btn(width/2 - 50,10+(i*55),125,50, dataArray[i]["name"]);
    }
    currentButtons = buttonArrayDataSelection;
  } 

}

function drawIndexes() {

  textSize(25);

  for (var i = 0; i < currentButtons.length; i++) {

    var xPosition = currentButtons[i].getXPosition() + currentButtons[i].getWidth() + 10;
    var yPosition = currentButtons[i].getYPosition() + currentButtons[i].getHeight()/1.5;

    text(i, xPosition, yPosition);    
  }

}
