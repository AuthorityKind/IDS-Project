var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/"
}
var num = 1;

var lmao = 0;

var Characters = {
  //gerald: Object
}

//var names;

var characterPreset = {
  id: null,
  name: null,
  age: null,
  sex: null,
  occupation: null,
  religion: null,
  family: null,
}

function preload() {

  loadJSON(api + "characters", loadTotal);
  //loadJSON(api + resource.characters + num, loadCharacter)
}

function setup() {
  createCanvas(400, 400);
  console.log(lmao);
  //initializeCharacter();
  //printCharacter(Characters.gerald);
}

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

//needs to be paramitized
function initializeCharacter() {
  Characters.gerald = characterPreset;
}

function loadTotal(json) {
  var total = "total";

  lmao = Number(json.meta[total]);



  //console.log(lmao);
  // var names = new Array(json.length);

  // for(var i = 0; i < names.length; i++){
  //   names[i] = json[i].data.name;

  //   console.log(names[i]);
  // }
}