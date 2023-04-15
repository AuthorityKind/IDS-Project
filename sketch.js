const api = "https://spapi.dev/api/";
const dataKeys = ["characters", "locations", "families", "episodes"];
var targetData;

let characters;
var charactersKeys = [
  "id",
  "name",
  "age",
  "sex",
  "occupation",
  "religion",
  "family",
];

let locations;
var locationKeys = ["id", "name"];

let families;
var familiesKeys = ["id", "name", "characters"];

let episodes;
var episodeKeys = ["id", "name", "season", "episode", "air_date"];

function setup() {
  setupData();
  loadSpecificData(dataKeys[0]);

  while(characters.content[0] === undefined){
    wait(100);
  }
  console.log(characters.content[0]);
}

function setupData() {
  characters = new Data(api + "characters", charactersKeys);
  locations = new Data(api + "locations", locationKeys);
  families = new Data(api + "families", familiesKeys);
  episodes = new Data(api + "episodes", episodeKeys);
}

/*
function initiateCharacterData() {
  loadJSON(characters.url, loadCharactersData);
}

function loadCharactersData(json) {
  const realTotal = Number(json.meta["last_page"]);
  const fakeTotal = 20;
  for (var i = 1; i <= fakeTotal; i++) {
    loadJSON(api + "characters?page=" + i, loadCharactersDataCluster);
  }
  wait(10000);
  good = true;
}

function loadCharactersDataCluster(json) {
  if (json != null && json != undefined) {
    for (var i = 0; i < Number(json.meta["per_page"]); i++) {
      var values = Object.values(json.data[i]);
      var keys = Object.keys(json.data[i]);
      //console.log(values);
      //console.log(keys);

      //console.log(createObject(keys,values));
      charactersContent.push(createObject(keys, values));

      if (values[0] == 1) {
        //console.log(values[1]);
        fuck = values[1];
      }

      wait(1000);
    }
  }
}

function createObject(keys, values) {
  let obj = {};

  keys.forEach((key, i) => {
    obj[key] = values[i];
  });
  //console.log("created object: " + obj);
  return obj;
}
*/

function wait(num) {
  var count = 0;
  while (count < num) {
    count++;
  }
}

function loadSpecificData(name) {
  targetData = name;
  loadJSON(getDataCollection(targetData).url, loadData);
}

function loadData(json) {
  const realTotal = Number(json.meta["last_page"]);
  for (var i = 1; i <= realTotal; i++) {
    //wait(500);
    loadJSON(api + targetData + "?page=" + i, loadDataCluster);
  }
}

function loadDataCluster(json) {
  if (json != null && json != undefined) {
    for (var i = 0; i < Number(json.meta["per_page"]); i++) {
      //const obj = ;
      getDataCollection(targetData).content.push(json.data[i]);
      console.log(json.data[i]);
      //wait(500);
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