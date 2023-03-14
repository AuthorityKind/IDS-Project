var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/",
};
var num = 1;

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

function preload() {
  loadJSON(api + "characters/", loadData);
}

function setup() {
  //createCanvas(400, 400);
  //console.log(test);
  console.log(names);
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

function loadData(json) {
  total = Number(json.meta["total"]);
  names = new Array(total);
  test = json.data[0]["name"];

  for (var i = 0; i < Number(json.meta["last_page"]); i++) {
    loadJSON(api + "characters?page=" + i++,loadDataCluster)
  }
}

function loadDataCluster(json) {
  for (var i = 0; i < Number(json.meta["per_page"]); i++) {
    names[i + (Number(json.meta["from"]) - 1)] = json.data[i]["name"];
  }
}
