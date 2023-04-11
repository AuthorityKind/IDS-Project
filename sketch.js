class Data {
  constructor(url, keys) {
    this.url = url;
    this.keys = keys;
    this.content;
    this.preset = {};
  }

  setupPreset() {
    this.keys.forEach(this.addKeyToIndex);
  }

  addKeyToIndex(key) {
    this.preset[key] = 0;
  }

  initiateLoading() {
    this.setupPreset();
    loadJSON(this.url, this.loadData);
  }

  loadData(json) {
    this.content = Array(json.meta["total"]);

    for (var i = 1; i < Number(json.meta["last_page"]) - 1; i++) {
      loadJSON(url + "?page=" + i, this.loadDataCluster)
    }
  }

  loadDataCluster(json) {
    for (var i = 0; i < Number(json.meta["per_page"]); i++) {
      var contentIndex = Number(json.meta["from"]) - 1;
      this.content[contentIndex] = new Object.create(this.preset);

      for (var j = 0; j < this.keys.length; j++) {
        this.content[this.keys[j]][i + contentIndex] = json.data[i][this.keys[j]];
      }
    }
  }

  getContent(i) { return content[i]; }

  printContent(i) { console.log(this.getContent(i)); }

  printAllContent() {
    content.forEach(index => {
      console.log(index);
    });
  }
}
//
// make a class for "content" which will be characters, locations, families, episodes to try and some this shit up
//

var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/",
};

var characters = new Data(api + "characters", ["id", "name", "age", "sex", "occupation", "religion", "family"]);

/*
var characters = {
  id: [],
  name: [],
  age: [],
  sex: [],
  occupation: [],
  religion: [],
  family: [],
}
*/
//var total = 200;

//var charactersKeys = Object.keys(characters);

function preload() {
  characters.initiateLoading();
  //loadJSON(api + "characters/", loadData);
}

function setup() {
  //createCanvas(400, 400);

  characters.printContent(0);

  //printAllCharacters();
}

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

