var api = "https://spapi.dev/api/";

var characters;

function preload() {
  characters = new Data(api + "characters", ["id", "name", "age", "sex", "occupation", "religion", "family"]);
  characters.initiateLoading();
  //loadJSON(api + "characters/", loadData);
}

function setup() {
  //createCanvas(400, 400);

  characters.printContent(0);

  //printAllCharacters();
}

/*

function getCharacter(index) {
  var out = Array(charactersKeys.length);

  for (var i = 0; i < out.length; i++) {
    out[i] = characters[charactersKeys[i]][index];
  }

  return out;
}

function printAllCharacters() {
  for (var i = 0; i < total; i++) {
    printCharacter(i);
  }
}

function printCharacter(index) {
  var out = Array(charactersKeys.length);

  for (var i = 0; i < out.length; i++) {
    out[i] = characters[charactersKeys[i]][index];
  }

  console.log(out);
}

function loadData(json) {
  for (var i = 1; i < Number(json.meta["last_page"]) - 1; i++) {
    loadJSON(api + "characters?page=" + i, loadDataCluster)
  }
}

function loadDataCluster(json) {
  for (var i = 0; i < Number(json.meta["per_page"]); i++) {
    for (var j = 0; j < charactersKeys.length; j++) {
      characters[charactersKeys[j]][i + (Number(json.meta["from"]) - 1)] = json.data[i][charactersKeys[j]];
    }
  }
}
*/
