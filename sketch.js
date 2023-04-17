// machine learning variables. Taken from Mads Hobye's example.
// we're using the ml5js library for machine learning, 
var classifier; // will be used for this function; https://learn.ml5js.org/#/reference/sound-classifier
const options = { probabilityThreshold: 0.8 };
var label;
var confidence;
var word; // the word that the machine learning algorithm guesses

// the buttons currently in use
var currentButtons = [];
var backButton;

function preload() {
  classifier = ml5.soundClassifier("SpeechCommands18w", options); // Taken from Mads Hobye's example
}

function setup() {
  createCanvas(600, 600);

  setupData();

  label = createDiv("Label: ..."); // Taken from Mads Hobye's example
  confidence = createDiv("Confidence: ...");
  classifier.classify(function (error, results) {
    // A function to run when we get any errors and the results
    // from example
    // Display error in the console
    if (error) {
      console.error(error);
    }
    // The results are in an array ordered by confidence.
    // Show the first label and confidence
    label.html("Label: " + results[0].label);
    confidence.html("Confidence: " + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
    word = results[0].label;
    moveArrow(word);
  });

  backButton = new Btn(10, 550, 100, 40, "Back");
}

// our variable for which screen should be drawn. Initialized to the starting screen.
var currentScreen = "Start";

// what should be drawn on the screen
var goBack = false; // if our choosing to go back box should be drawn
var choosingPage = false; // if our choosing page box should be drawn

function draw() {
  // draw the current screen we are on
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

  currentButtons.forEach((button) => {
    // draw the current buttons, depends on selected page
    button.drawButton();
  });

  if (currentScreen != "Start") {
    // we do not need a back button on the start page
    backButton.drawButton();
    // info for going back voice commands
    fill(230);
    rect(10, 450, 100, 90);
    fill(0);
    textSize(15);
    text("Back function:", 14, 465);

    textSize(13);
    text('Say "no" to \n go back', 23, 495);
  }
  if (currentScreen == "data_selection") {
    fill(230);
    rect(115, 450, 150, 90);
    fill(0);
    textSize(15);
    text("Switch page function:", 119, 465);

    textSize(13);
    text('Say "left" or "right" \nto scroll through \nthe list.', 119, 485);
  }

  fill(125);
  drawIndexes();
  drawArrow();

  if (choosingPage) {
    // message if the user wants to proceed to next page or stay
    fill(250, 0, 0);
    rect(150, 250, 300, 100);
    fill(0);
    textSize(19);
    text("Do you want to access this page?", 155, 285);
    text('Say "yes" to enter, "no" to reselect', 155, 315);
  }
  if (goBack) {
    // message if the user wants to proceed to go back or stay
    fill(250, 0, 0);
    rect(150, 250, 300, 100);
    fill(0);
    textSize(19);
    text("Do you want to go back?", 155, 285);
    text('Say "yes" to enter, "no" to stay', 155, 315);
  }
}

// array to store 10 objects at a time, which is the data gotten from loadJSON
var dataArray = [];

const api = "https://spapi.dev/api/";

class Data {
  constructor(inUrl, inKeys) {
    this.url = inUrl;
    this.keys = inKeys;
    this.content = [];
  }
}

//variable declaration to get and hold data from API
var characters;
var charactersKeys = [
  "id",
  "name",
  "age",
  "sex",
  "occupation",
  "religion",
  "family",
];

var locations;
var locationKeys = ["id", "name"];

var families;
var familiesKeys = ["id", "name", "characters"];

var episodes;
var episodeKeys = ["id", "name", "season", "episode", "air_date"];

var targetData;

function setupData() {
  // create objects to hold data from API
  characters = new Data(api + "characters", charactersKeys);
  locations = new Data(api + "locations", locationKeys);
  families = new Data(api + "families", familiesKeys);
  episodes = new Data(api + "episodes", episodeKeys);
}

function loadEntries(name, index) {
  dataArray = [];
  targetData = name;

  for (var i = index; i <= index + 10; i++) {
    loadJSON(getDataCollection(targetData).url + "/" + i, function (json) {
      dataArray.push(json.data);
    });
  }
  loadDataIndex = i;
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

// counter is to check if a character has already been selected
var counter = 0;

function drawTraits() {
  background(200);

  currentButtons.forEach((button) => {
    button.drawButton();
    if (button.isOn && counter == 0) {
      counter++;
      currentResource = [];

      while (typeof currentResource === "undefined") {
        // if the character somehow is undefined, run the same line until it is not
        currentResource = [];
      }
    } else if (!button.isOn) {
      counter = 0; // reset button
    }
  });

  if (word == "up") {
    // to check if up works by changing color, easter egg.
    fill(255, 160, 90);
  } else {
    fill(100, 255, 167);
  }

  rect(125, 100, 400, 400);
  textSize(20);
  fill(0);
  text("Traits: ", 200, 120);

  counter2 = 0; // counter for the items in the data array

  // loop to display the stats of the selected data. dataArray[dataIndex] represents a specific character, episode...
  for (var key in dataArray[dataIndex]) {
    // the if statement ensures that keys that does not matter to the user are not displayed
    if (
      dataArray[dataIndex] != null &&
      dataArray[dataIndex][key] != null &&
      key != "updated_at" &&
      key != "created_at" &&
      key != "url" &&
      key != "family" &&
      key != "episodes" &&
      key != "wiki_url" &&
      key != "thumbnail_url" &&
      key != "locations" &&
      key != "characters"
    ) {
      text(key + ":", 130, 100 + (70 + counter2 * 40)); // display items
      var display = dataArray[dataIndex][key];
      if (key == "relatives") {
        display = dataArray[dataIndex][key].length;
      }
      text(display, 250, 100 + (70 + counter2++ * 40)); // increment counter in the last one.
    }
  }
}

// button array for start page and dataSelection page
var buttonArrayStartpage = [];
const dataKeys = ["characters", "episodes", "families", "locations"]; 

function startPage() {
  background(200);
  fill(0);
  textSize(28);
  text(
    "Welcome to our voice activated program.\nYou use your voice exclusively to navigate.",
    7,
    25
  );

  fill(230);
  rect(400, 300, 190, 200);
  fill(0);
  textSize(19);
  text("Info: how to use", 405, 325);

  textSize(13);
  text(
    'In order to navigate through\nthe site; say "up" to move\nthe arrow one button up,\n"down" to move it one down.\nOr you can specify which\nbutton you want to use by\nsaying its number.',
    405,
    345
  );

  if (buttonArrayStartpage.length == 0) {
    var i = 0;

    dataKeys.forEach((element) => {
      buttonArrayStartpage.push(new Btn(250, 150 + i++ * 75, 100, 40, element));
    });
  }

  if (currentButtons.length == 0) {
    currentButtons = buttonArrayStartpage;
  }
}

var timer; // timer to ensure that we do not use the same word too quickly
var dataSelectionIndex; // index for dataSelection data
var dataIndex; // index for the data page
var currentIndex = 0;
var loadDataIndex = 1;
var arrowPosition = 0; // poistion of our arrow
const numEntries = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

var buttonArrayDataSelection = [];

function moveArrow(newWord) {
  if (newWord == word && timer + 1000 > millis()) {
    return; // return if same word within 1000 ms
  }
  timer = millis();

  // choosing to go back or not
  if (goBack) {
    if (word == "yes") {
      // if we want to go back
      changeScreen("last");
      goBack = false;
    } else if (word == "no") {
      // if we want to stay
      goBack = false;
    }
    return; // we do not want to execute further. Only yes or no when selecting to go back or not.
  }

  // if we are choosing a specific page
  if (choosingPage) {
    if (word == "yes") {
      if (currentScreen == "Start") {
        dataSelectionIndex = arrowPosition;
        currentIndex = dataSelectionIndex;

        dataArray = []; // reset data array so we can load new data
        loadEntries(dataKeys[currentIndex], loadDataIndex, function (_dataArray) { }); //underscored parameters to indicate that they aren't important
        changeScreen("data_selection");
        buttonArrayDataSelection = []; // reset buttons to make new buttons with the new data
      } else if (currentScreen == "data_selection") {
        buttonArrayDataSelection = [];
        dataIndex = arrowPosition;
        currentIndex = dataIndex;
        changeScreen("data_page");
      }
      choosingPage = false;
    } else if (word == "no") {
      choosingPage = false;
    }
    return;
  }
  // we do not want to execute further. Only yes or no when selecting a page.

  if (word == "right") {
    buttonArrayDataSelection = []; // reset buttons to make new buttons with the new data
    dataArray = []; // reset data array so we can load new data
    loadEntries(dataKeys[dataSelectionIndex], loadDataIndex, function () { });
  } else if (word == "left" && loadDataIndex != 1) {
    if (loadDataIndex - 22 < 1) {
      return;
    }
    loadDataIndex -= 22; // to go back find index for the last
    buttonArrayDataSelection = []; // reset buttons to make new buttons with the new data
    dataArray = []; // reset data array so we can load new data
    loadEntries(
      dataKeys[dataSelectionIndex],
      loadDataIndex,
      function (_dataArray) { }
    );
  }

  // the last two if statements needs to be at the top, because we dont want to run the rest of the code if we go into them

  // go commands
  if (word == "go" && currentScreen != "data_page") {
    // cannot go further if we are on the data page
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

  // prompt to go back to last screen
  if (word == "no" && currentScreen != "start_page") {
    // cannot go back on the starting page
    goBack = true;
  }

  // navigation commands, numbers
  for (var i = 0; i < numEntries.length; i++) {
    if (numEntries[i] == word) {
      updateArrowPosition(i);
      break;
    }
  }
  word = null;
}

function changeScreen(newScreen) {
  if (newScreen == "last") {
    // go back
    if (currentScreen == "data_selection") {
      // if on data selection
      currentScreen = "Start"; // go back to start
      loadDataIndex = 1; // reset index for loading data.
    } else {
      currentScreen = "data_selection"; // else if on data page, go back to data selection
    }
  } else {
    // go forward to the next screen, specified by the parameter "newScreen"
    currentScreen = newScreen;
  }

  // reset variables
  goBack = false;
  choosingPage = false;

  arrowPosition = 0;
  currentButtons = [];
}

function updateArrowPosition(number) {
  if (number < currentButtons.length) {
    // update arrow position if that index is available
    arrowPosition = number;
  }
}

var contentLoaded = false;
var btnWidth;

function dataSelectionPage() {
  background(220);

  fill(12);
  textSize(32);
  text("page: " + dataKeys[dataSelectionIndex], 10, 50);

  for (var i = 0; i < 10; i++) {
    if (typeof dataArray[i] == "undefined") {
      contentLoaded = false;
      break;
    }
    if (i == 9) {
      // only set contentLoaded to true if every object has been loaded into the array
      contentLoaded = true;
    }
  }

  if (contentLoaded && buttonArrayDataSelection.length == 0) {
    // if data has been loaded and there has not been made buttons yet
    if (
      dataKeys[dataSelectionIndex] == "locations" ||
      dataKeys[dataSelectionIndex] == "episodes"
    ) {
      btnWidth = 225;
    } else {
      btnWidth = 125;
    }
    for (var i = 0; i < 10; i++) {
      buttonArrayDataSelection[i] = new Btn(
        width / 2,
        10 + i * 55,
        btnWidth,
        50,
        dataArray[i]["name"]
      ); // create button for that data
    }
    currentButtons = buttonArrayDataSelection; // set buttons
  } else if (!contentLoaded) {
    // if data has not been loaded
    textSize(100); // big
    fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    text("LOADING\nDATA", 10, 150); // loading message on screen
  }
}

function drawArrow() {
  if (
    typeof currentButtons[arrowPosition] != "undefined" &&
    arrowPosition < currentButtons.length
  ) {
    // draw arrow for buttons
    // we want to draw the arrow to the left of the button it is at. Roughly in the middle
    var xPositionArrow = currentButtons[arrowPosition].getXPosition() - 40;
    var yPositionArrow =
      currentButtons[arrowPosition].getYPosition() +
      currentButtons[arrowPosition].getHeight() -
      13;

    fill(0);
    textSize(25);
    text(">", xPositionArrow, yPositionArrow);

    text("arrow pos: " + arrowPosition, 50, 400); //  debug tool and help to identify where the arrow is located
  }
}

function drawIndexes() {
  // same as function above but for indexes
  textSize(25);

  for (var i = 0; i < currentButtons.length; i++) {
    var xPosition =
      currentButtons[i].getXPosition() + currentButtons[i].getWidth() + 10;
    var yPosition =
      currentButtons[i].getYPosition() + currentButtons[i].getHeight() / 1.5;

    var xPosition = currentButtons[i].getXPosition() - 23;
    var yPosition =
      currentButtons[i].getYPosition() + currentButtons[i].getHeight() / 1.5;

    text(i, xPosition, yPosition);
  }
}