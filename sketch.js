var api = "https://spapi.dev/api/";
var arr = [];
var isLoading = false;
var loadCheck = {
  characters: false,
  locations: false,
  families: false,
  episodes: false
}
const loadKeys = Object.keys(loadCheck);

var characters;
var charactersKeys = ["id", "name", "age", "sex", "occupation", "religion", "family"];

var locations;
var locationKeys = ["id", "name"];

var families;
var familiesKeys = ["id", "name", "characters"];

var episodes;
var episodeKeys = ["id", "name", "season", "episode", "air_date"];

function preload() {
  characters = new Data(api + "characters", charactersKeys);
  locations = new Data(api + "locations", locationKeys);  
  families = new Data(api + "families", familiesKeys);
  episodes = new Data(api + "episodes", episodeKeys);
  initiateLoading();
}

function setup() {
  //loadJSON(characters.url, loadData);
  console.log(characters.content);
  console.log(locations.content);
  console.log(families.content);
  console.log(episodes.content);

  //arr = resetArr();
  //loadJSON(locations.url, loadData)

}

function initiateLoading(){
  for(var i = 0; i < loadKeys.length; i++){
    while(loadCheck[loadKeys[]] == false){
      if(isLoading == false){
        loadJSON(getLoadingCollection().url, loadData);
      }
    }
  }
  loadKeys.forEach(key => {
    
  });
}

function loadData(json) {
  //const realTotal = Number(json.meta["last_page"]);
  isLoading = true;
  const fakeTotal = 20;

  for (var i = 1; i <= fakeTotal; i++) {
    loadJSON(api + checkCurrentlyLoading() + "?page=" + i, loadDataCluster);
  }

  loadCheck[checkCurrentlyLoading()] = true;
  isLoading = false;
}

function loadDataCluster(json) {
  for (var i = 0; i < Number(json.meta["per_page"]); i++) {
    const obj = json.data[i];
    getLoadingCollection().content.push(obj);
  }
}

function resetArr() {
  const out = [];
  return out;
}

function checkCurrentlyLoading(){
  for(var i = 0; i < loadKeys.length; i++){
    if(loadCheck[loadKeys[i]] == false){
      return loadKeys[i];
    }
  }
}

function getLoadingCollection(){
  switch (checkCurrentlyLoading()){
    case loadKeys[0]:
      return characters;
    case loadKeys[1]:
      return locations;
    case loadKeys[2]:break;
      return families;
    case loadKeys[3]:
      return episodes;
  }
}