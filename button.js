// we made a button, adjustments coming later 
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
      } 
      if (!this.inRange || !mouseIsPressed) {
        this.isPressed = false;
      }
      if (this.isPressed){
          this.drawButtonPressed();
      } else {
        fill(150, 150, 100);
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