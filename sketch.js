// machine learning variables. Taken from example.

let classifier;
const options = { probabilityThreshold: 0.75 };
let label;
let confidence;
let currentScreen = "Start";
let word;
let arrowPosition = 0;

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

var buttonArrayCharacters = [];
var buttonArrayEpisodes = [];
var buttonArrayFamilies = [];
var buttonArrayLocations = [];


// variable for total amount of south park(sp) characters that the api has
var total;

// array for the names of the sp characters
var names = [];

// the different categories that we can load from
var resourceNames = ["Characters", "Families", "Locations", "Episodes"];

// the current resource that we want to display, is represented as an object. 
var currentResource;

// we add functionality to load only the characters for now
function preload() {
  classifier = ml5.soundClassifier('SpeechCommands18w', options); // taken from example
  var url = api + resource["characters"]; // create the final url
  loadJSON(url, loadData); // load the data
}


function setup() {
  createCanvas(600, 600);
  label = createDiv('Label: ...'); // taken from example
  confidence = createDiv('Confidence: ...'); // taken from example
  classifier.classify(gotResult); // taken from example
  var i = 0;

  buttonArrayStart.push(new Btn(60 + (i * 75), 10, 70, 25, resourceNames[i]));
  buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Characters"));
  buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Episodes"));
  buttonArrayStartpage.push(new Btn(250, 150 + (i++*75), 100, 40, "Families"));
  buttonArrayStartpage.push(new Btn(250, 150 + (i*75), 100, 40, "Locations"));

  

  //buttonArray.push(new Btn(60 + (i*75),10,70,25, "Clear"));
  console.log(names); // print all the names array
  print(charactersFromJSON); // print the array of character objects
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

    default:
      print("koko");
      break;
  }
}

function drawTraits() {
  for (i = 0; i < buttonArrayStart.length; i++) {
    buttonArrayStart[i].drawButton();
    if (buttonArrayStart[i].isOn && counter == 0) {

      counter++;
      currentResource = charactersFromJSON[int(random(1, charactersFromJSON.length - 1))];

      while (typeof currentResource === 'undefined') { // if the character somehow is undefined, run the same line until it is not
        currentResource = charactersFromJSON[int(random(1, charactersFromJSON.length - 1))];
      }

      print(currentResource);

    } else if (!buttonArrayStart[i].isOn) {
      counter = 0; // reset button
    }
    
  }

  if (word == "up") {
    fill(255, 160, 90);
  } else {
    fill(100,255,167);
  }
  rect(100, 100, 400, 400);
  textSize(20);
  fill(0);
  text("Traits: ", 200, 120);
  counter2 = 0; // counter for the items in the current resource

  for (let key in currentResource) { // we want to display every key and value from the object except the ones in the if condition. 
    if (currentResource[key] != null && key != "updated_at" && key != "created_at" && key != "episodes" && key != "url" && key != "relatives" && key != "id" && key != "family") {

      text(key + ":", 120, 100 + (70 + (counter2 * 40))); 
      text(currentResource[key], 250, 100 + (70 + (counter2 * 40))); 
      counter2++;
      
    }
  }
}

function startPage() {
  background(200);
  fill(100);
  textSize(32);
  text("hello welcome to our program.\n You use your voice to navigate here...", 10, 100);
  
  let currentButton;
  
  for (let i = 0; i < buttonArrayStartpage.length; i++) {
    buttonArrayStartpage[i].drawButton();
    currentButton = buttonArrayStartpage[i];
  }

  let xPositionArrow = currentButton.getXPosition() - 30;
  let yPositionArrow = currentButton.getYPosition() + currentButton.getHeight()/1.5;

  fill(0);
  textSize(25);
  text("->", xPositionArrow, yPositionArrow);
}

var charactersFromJSON = []; // array to store the character objects

function loadData(json) {
  total = Number(json.meta["total"]); // set total to number of characters on api 
  names = new Array(total);
  for (var i = 1; i < Number(json.meta["last_page"] - 1); i++) { // loop over the pages (we skip the last 2 because there are errors) to collect data
    loadJSON(api + "characters?page=" + i, loadDataCluster); 
  }
}

function loadDataCluster(json) {
  var length = 0;
  if (charactersFromJSON.length != 0) {
    length = charactersFromJSON.length + 1; // to find the correcet index in the array
  }
  
  for (var i = 0; i < Number(json.meta["per_page"]); i++) {
    names[i + (Number(json.meta["from"]) - 1)] = json.data[i]["name"]; // insert name into name array
    charactersFromJSON[length + i] = json["data"][i]; // insert object into the character array
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
  word = results[0].label;
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
}


