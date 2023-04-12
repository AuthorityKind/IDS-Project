var api = "https://spapi.dev/api/";

var characters;
var charactersKeys = ["id", "name", "age", "sex", "occupation", "religion", "family"];
var arr = [];

function preload() {
}

function setup() {
  
  var characterUrl = "https://spapi.dev/api/characters";
  characters = new Data(characterUrl, charactersKeys);

  loadJSON(characters.url, loadData);
  characters.setContent(arr);
  console.log(characters.content);
}

function loadData(json) {
  const realTotal = Number(json.meta["total"]);
  const fakeTotal = 20;

  for (var i = 1; i <= fakeTotal; i++) {
    loadJSON(api + "characters?page=" + i, loadDataCluster);
  }
}

function loadDataCluster(json) {
  const indexCounter = Number(json.meta["from"]) - 1;
  for (var i = 0; i < Number(json.meta["per_page"]); i++) {
    var obj = {};
    for (var j = 0; j < charactersKeys.length; j++) {
      obj[charactersKeys[j]] = json.data[i][charactersKeys[j]];
    }
    arr.push(obj);
  }
}