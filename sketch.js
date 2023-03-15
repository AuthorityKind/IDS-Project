var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/",
};
var num = 1;

var buttonArray = [];


var total = 0;
var test;
var characters = {};

var characterPreset = {
  id: null,
  name: null,
  age: null,
  sex: null,
  occupation: null,
  religion: null,
  family: null,
};

var names = [];
var resourceNames = ["Characters", "Families", "Locations", "Episodes"];
var currentResource = toString();

function preload() {
  var url = api + "characters/";
  loadJSON(url, loadData);
}

function setup() {
  createCanvas(600, 600);
  //console.log(test);
  for (i = 0; i < resourceNames.length; i++) {
    buttonArray.push(new Btn(60 + (i*75),10,70,25, resourceNames[i]));
    }

    buttonArray.push(new Btn(60 + (i*75),10,70,25, "Clear"));
    console.log(names);
    print(charactersFromJSON);

}

function draw() {
  background(220);
  
  for (i = 0; i < buttonArray.length; i++) {
    buttonArray[i].drawButton();
    if (buttonArray[i].isOn) {
      currentResource = buttonArray[i].buttonText;
    }
    
  }
  drawTraits();
}

function drawTraits() {
  fill(255,160,90);
  rect(100,100, 400, 400);
  textSize(20);
  fill(0);
  text("Traits: " , 200, 120);
}

/*
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
var charactersFromJSON = [];
function loadData(json) {
  total = Number(json.meta["total"]);
  names = new Array(total);
  for (var i = 1; i < Number(json.meta["last_page"] - 1); i++) {
    loadJSON(api + "characters?page=" + i,loadDataCluster);
  }
}

function loadDataCluster(json) {
  for (var i = 0; i < Number(json.meta["per_page"]); i++) {
    charactersFromJSON[charactersFromJSON.length] = json.data;
    names[i + (Number(json.meta["from"]) - 1)] = json.data[i]["name"];
  }
}
