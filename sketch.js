var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/"
}
var num = 1;

var gerald = {
  id: null,
  name: null,
  age: null,
  sex: null,
  occupation: null,
  religion: null,
  family: null,
}

function preload() {
  loadJSON(api + resource.characters + num,loadCharacter)
}

function setup() {
  createCanvas(400, 400);
  printCharacter(gerald);
}

function loadCharacter(json) {
  var keyArr = Object.keys(gerald);
  for (var i = 0; i < keyArr.length; i++) {
    gerald[keyArr[i]] = json.data[keyArr[i]];
  }
}

function printCharacter() {
  var keyArr = Object.keys(gerald);
  var valueArr = Object.values(gerald);

  console.log("Here are Gerald's traits");
  for (var i = 0; i < keyArr.length; i++) {
    console.log(keyArr[i] + ": " + valueArr[i]);
  }
}