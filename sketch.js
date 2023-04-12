const api = "https://spapi.dev/api/";
const dataKeys = ["characters", "locations", "families", "episodes"];
var targetData;

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

function preload() {}

function setup() {
  setupData();
  loadSpecificData(dataKeys[1]);
  console.log(getDataCollection(targetData).content);
}

function setupData() {
  characters = new Data(api + "characters", charactersKeys);
  locations = new Data(api + "locations", locationKeys);
  families = new Data(api + "families", familiesKeys);
  episodes = new Data(api + "episodes", episodeKeys);
}

//function initiateLoading() {}

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
