
// api variables

var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/",
};

// button array
var buttonArray = [];


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
  var url = api + resource["characters"]; // create the final url
  loadJSON(url, loadData); // load the data
}


function setup() {
  createCanvas(600, 600);
  //console.log(test);
  buttonArray.push(new Btn(60 + (i * 75), 10, 70, 25, resourceNames[i]));

  //buttonArray.push(new Btn(60 + (i*75),10,70,25, "Clear"));
  console.log(names); // print all the names array
  print(charactersFromJSON); // print the array of character objects
}

// counter is to check if a character has already been selected
var counter = 0;
function draw() {
  background(220);

  for (i = 0; i < buttonArray.length; i++) {
    buttonArray[i].drawButton();
    if (buttonArray[i].isOn && counter == 0) {

      counter++;
      currentResource = charactersFromJSON[int(random(1, charactersFromJSON.length - 1))];

      while (typeof currentResource === 'undefined') { // if the character somehow is undefined, run the same line until it is not
        currentResource = charactersFromJSON[int(random(1, charactersFromJSON.length - 1))];
      }

      print(currentResource);

    } else if (!buttonArray[i].isOn) {
      counter = 0; // reset button
    }
  }
  drawTraits();
}

function drawTraits() {
  fill(255, 160, 90);
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

/* old stuff ;)
function loadCharacter(json) {
  var keyArr = Object.keys(Characters.gerald);
  for (var i = 0; i < keyArr.length; i++) {
    Characters.gerald[keyArr[i]] = json.data[keyArr[i]];
  }
}

function printCharacter() {
  var keyArr = Object.keys(Characters.gerald);
  var valueArr = Object.values(Characters.gerald);

  console.log("Here are Gerald's traits");
  for (var i = 0; i < keyArr.length; i++) {
    console.log(keyArr[i] + ": " + valueArr[i]);
  }
}
function initializeCharacter() {
  Characters.gerald = characterPreset;
}
*/


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

