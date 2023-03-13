// buttons
var buttons = [];

var currentResource = "";


// api stuff 
var api = "https://spapi.dev/api/";
var resource = {
  episodes: "episodes/",
  locations: "locations/",
  families: "families/",
  characters: "characters/"
}

// character array, as well as current character object
var characterArray = [];
var curCharacter = {};

// reset object
function resetCharacter() {
  curCharacter = {
  id: null,
  name: null,
  age: null,
  sex: null,
  occupation: null,
  religion: null,
  family: null}
}

function preload() {
  resetCharacter(); // initialize character object variables
  for (i = 1; i <= 10; i++) { 
      loadJSON(api + resource.characters + i, loadCharacter);
  }
}


function setup() {
    createCanvas(400, 400);
    // the buttons for the "overheads" maybe loops to make the rest?
    buttons.push(new Btn(10,10,70,25, "Characters"));
    buttons.push(new Btn(90,10,70,25, "Families"));
    buttons.push(new Btn(170,10,70,25, "Locations"));
    buttons.push(new Btn(250,10,70,25, "Episodes"));

    
    for (var i = 0; i < characterArray.length; i++) {
      printCharacter(characterArray[i]);
    }
    console.log(characterArray);
  }
  
  // for the buttons
  function draw() {
    background(220);
    
    for (i = 0; i < buttons.length; i++) {
      buttons[i].drawButton();
    }

  }


  // load the character and insert the object into the array
  function loadCharacter(json) {
    var keyArr = Object.keys(curCharacter);
    for (var i = 0; i < keyArr.length; i++) {
      curCharacter[keyArr[i]] = json.data[keyArr[i]];
    }
    append(characterArray, curCharacter);
    resetCharacter();
  }
  

  // character traits, maybe make it more general to include families... 
  function printCharacter(character) {
      console.log("Here are the current character's traits: " + character.name);
      console.log(character);
  }


  // setters and getters for resourceitem
  function setResourceItem(item) {
      currentResource = item.toLowerCase();
  }

  function getResourceItem() {
    console.log(api + currentResource + '/' + "1");
    return api + currentResource + '/' + "1";
  }


  // alt herfra er fra et tidligere ids kursus, lidt adjusted
  class Btn{
  
    constructor (x, y, width, height, buttonText) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.buttonText = buttonText;

      this.isPressed = false;
      this.isOn = false;
      this.inRange = false;
    }
    changeState() {
      this.isOn = !this.isOn;
    }
    isMouseInRange() {
      this.inRange = (mouseX > this.x && mouseX < this.x + this.width) && 
          (mouseY > this.y && mouseY < this.y + this.height);
    }
    drawButton() {
    this.isMouseInRange();
      if (this.inRange && mouseIsPressed){
        if (this.isPressed == false){
          this.changeState();
        }
        this.isPressed = true;
        setResourceItem(this.buttonText);
        getResourceItem();

      } 
      if (!this.inRange || !mouseIsPressed) {
        this.isPressed = false;
      }
      if (this.isPressed){
          this.drawButtonPressed();
      } else {
        fill(200,200,200);
        rect(this.x,this.y,this.width,this.height);
      }
      textSize(12);
      fill(0);
      text(this.buttonText, this.x + 5, this.y + this.height/2 + 3);
    }
    drawButtonPressed() {
      fill(255,255,255);
      rect(this.x,this.y,this.width,this.height);
    }
}