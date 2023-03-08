var api = "https://spapi.dev/api/";
var num = 1;
var episodes = "episodes/";
var locations = "locations/";
var families = "families/";
var characters = "characters/";

var curEpisode;

var curData;


function preload() {
  curEpisode = episodes + num;
  curData = loadJSON(api+curEpisode);
 
}

function setup() {
  createCanvas(400, 400); 
  console.log(curData.data.name);
} 

function draw() {
  fill(200,200,200);
  rect(100,100,100,100);
}