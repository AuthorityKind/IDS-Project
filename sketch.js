// machine learning variables. Taken from example.
let classifier;
const options = { probabilityThreshold: 0.8 };
let label;
let confidence;
let word; // the word that the machine learning algorithm guesses

// our variable for which screen should be drawn. Initialized to the starting screen.
let currentScreen = "Start";

// what should be drawn on the screen
let arrowPosition = 0; // poistion of our arrow
let choosingPage = false; // if our choosing page box should be drawn
let goBack = false; // if our choosing to go back box should be drawn

// api variables
const api = "https://spapi.dev/api/";
const dataKeys = ["characters", "episodes", "families", "locations"];

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

// array to store 10 objects at a time, which is the data gotten from loadJSON
let dataArray = [];

// button array for start page and dataSelection page
let buttonArrayStartpage = [];
let buttonArrayDataSelection = [];

let backButton;

// the buttons currently in use
let currentButtons = [];

function preload() {
  classifier = ml5.soundClassifier("SpeechCommands18w", options); // taken from example
}

function setup() {
  createCanvas(600, 600);

  setupData();

  label = createDiv("Label: ..."); // taken from example
  confidence = createDiv("Confidence: ..."); // taken from example
  classifier.classify(gotResult); // taken from example

  backButton = new Btn(10, 550, 100, 40, "Back");
}

function setupData() {
  // create objects to
  characters = new Data(api + "characters", charactersKeys);
  locations = new Data(api + "locations", locationKeys);
  families = new Data(api + "families", familiesKeys);
  episodes = new Data(api + "episodes", episodeKeys);
}

function load10(name) {
  dataArray = [];
  targetData = name;

  for (var i = 1; i <= 10; i++) {
    loadJSON(getDataCollection(targetData).url + "/" + i, function (json) {
      dataArray.push(json.data);
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
      while (count < 10000) {
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
  switch (
    currentScreen // draw the current screen we are on
  ) {
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

  for (var i = 0; i < currentButtons.length; i++) {
    // draw the current buttons, depends on selected page
    currentButtons[i].drawButton();
  }
  if (currentScreen != "Start") {
    // we do not need a back button on the start page
    backButton.drawButton();
    drawBackInfo();
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

function drawBackInfo() {
  // info for going back voice commands
  fill(230);
  rect(10, 450, 100, 90);
  fill(0);
  textSize(15);
  text("Back function:", 14, 465);

  textSize(13);
  text('Say "no" to \n go back', 23, 495);
}

function drawTraits() {
  background(200);

  for (i = 0; i < currentButtons.length; i++) {
    currentButtons[i].drawButton();
    if (currentButtons[i].isOn && counter == 0) {
      counter++;
      currentResource = [];

      while (typeof currentResource === "undefined") {
        // if the character somehow is undefined, run the same line until it is not
        currentResource = [];
      }
    } else if (!currentButtons[i].isOn) {
      counter = 0; // reset button
    }
  }

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
  for (let key in dataArray[dataIndex]) {
    // the if statement ensures that keys that does not matter to the user are not displayed
    if (
      dataArray[dataIndex] != null &&
      dataArray[dataIndex][key] != null &&
      key != "updated_at" &&
      key != "created_at" &&
      key != "url" &&
      key != "family" &&
      key != "episodes" &&
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

function infoBox() {
  fill(230);
  rect(400, 300, 190, 200);
  fill(0);
  textSize(20);
  text("Info: how to use", 405, 325);

  textSize(15);
  text(
    'In order to navigate through\nthe site; say "up" to move\nthe arrow one button up,\n"down" to move it one down.\nOr you can specify which\nbutton you want to use by\nsaying its number.',
    405,
    345
  );
}

function startPage() {
  background(200);
  fill(0);
  textSize(31);
  text(
    "Welcome to our voice activated program.\nYou use your voice exclusively to navigate.",
    7,
    25
  );

  infoBox();

  if (buttonArrayStartpage.length == 0) {
    var i = 0;
    buttonArrayStartpage.push(
      new Btn(250, 150 + i++ * 75, 100, 40, "Characters")
    );
    buttonArrayStartpage.push(
      new Btn(250, 150 + i++ * 75, 100, 40, "Episodes")
    );
    buttonArrayStartpage.push(
      new Btn(250, 150 + i++ * 75, 100, 40, "Families")
    );
    buttonArrayStartpage.push(
      new Btn(250, 150 + i++ * 75, 100, 40, "Locations")
    );
    currentButtons = buttonArrayStartpage;
  }

  if (currentButtons.length == 0) {
    currentButtons = buttonArrayStartpage;
  }
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
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
}

let timer; // timer to ensure that we do not use the same word too quickly
let dataSelectionIndex; // index for dataSelection data
let dataIndex; // index for the data page

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
      console.log(currentScreen);
      if (currentScreen == "Start") {
        dataSelectionIndex = arrowPosition;
        currentIndex = dataSelectionIndex;

        dataArray = []; // reset data array so we can load new data
        load10(dataKeys[currentIndex], function (dataArray) {});
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

  // the last two if statements needs to be at the top, because we dont want to run the rest of the code if we go into them

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

  switch (word) {
    case "zero":
      updateArrowPosition(0);
      break;
    case "one":
      updateArrowPosition(1);
      break;
    case "two":
      updateArrowPosition(2);
      break;
    case "three":
      updateArrowPosition(3);
      break;
    case "four":
      updateArrowPosition(4);
      break;
    case "five":
      updateArrowPosition(5);
      break;
    case "six":
      updateArrowPosition(6);
      break;
    case "seven":
      updateArrowPosition(7);
      break;
    case "eight":
      updateArrowPosition(8);
      break;
    case "nine":
      updateArrowPosition(9);
      break;
  }

  /*
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
*/

  word = null;
}

function changeScreen(newScreen) {
  if (newScreen == "last") {
    // go back
    if (currentScreen == "data_selection") {
      // if on data selection
      currentScreen = "Start"; // go back to start
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

let contentLoaded = false;
let btnWidth;

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
    let xPositionArrow = currentButtons[arrowPosition].getXPosition() - 40;
    let yPositionArrow =
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
