// buttons
var buttons = [];

var currentResource = "";
var currentNumber = 0;


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
var curCharacter = null;

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



var names = ["Characters", "Families", "Locations", "Episodes"]
function setup() {
    createCanvas(600, 600);
    


    for (i = 0; i < names.length; i++) {
    buttons.push(new Btn(60 + (i*75),10,70,25, names[i]));

    }

    buttons.push(new Btn(60 + (i*75),10,70,25, "Clear"));


    for (i = 1; i <= 6; i++) {
      buttons.push(new Btn(110 + (i*30),50,20,20, i));
    }

  }
  
  // for the buttons
  function draw() {
    background(220);
    
    for (i = 0; i < buttons.length; i++) {
      buttons[i].drawButton();
    }

    drawTraits();



  }
  function drawTraits() {
    fill(255,160,90);
    rect(100,100, 400, 400);
    textSize(20);
    fill(0);
    text("Traits: " + currentResource, 200, 120);
    if (curCharacter != null) {


      var counter = 0;
      for (let key in curCharacter) {

        if (curCharacter[key] != null && curCharacter[key].length < 30) {
          text(key + ":", 120, 100 + (70 + (counter * 40)));
          text(curCharacter[key], 250, 100 + (70 + (counter * 40)));
          counter++;
        }
      }
    }
  }


  // load the character and insert the object into the array
  function loadCharacter(json) {
    resetCharacter();
    var keyArr = Object.keys(curCharacter);

    for (var i = 0; i < keyArr.length; i++) {
      curCharacter[keyArr[i]] = json.data[keyArr[i]];
    }
    append(characterArray, curCharacter);
  }
  

  // character traits, maybe make it more general to include families... 
  function printCharacter(character) {
      console.log("Here are the current character's traits: " + character.name);
      console.log(character);
  }

  // setters and getters for resourceitem
  function setResourceItem(item) {
    if (item.toLowerCase() != currentResource){
      currentResource = item.toLowerCase();
      currentNumber = 0;
      console.log(api + currentResource + '/');
    }
  }

  function setResourceNumber(number) {
    if (currentNumber != number){
      currentNumber = number;
      console.log(api + currentResource + '/' + currentNumber);
      var url = api + currentResource + '/' + currentNumber;
      loadJSON(url, gotData);
    }
  }

  function gotData(data) {
    dataFromURL = data;
    curCharacter = dataFromURL.data;
  }

  function getResourceItem() {
    return api + currentResource + '/' + currentNumber;
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

        if (this.buttonText.length > 5) {
          setResourceItem(this.buttonText);
        } else if (this.buttonText == "Clear"){
          curCharacter = null;
          currentResource = null;
        } else {
          setResourceNumber(this.buttonText);
        }

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