class Btn{
  
    constructor (x, y, width, height, buttonText) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.buttonText = buttonText;


    }

    drawButton() {
      fill(150, 150, 100);
      rect(this.x,this.y,this.width,this.height);
      textSize(12);
      fill(0);
      text(this.buttonText, this.x + 5, this.y + this.height/2 + 3);
    }


    getXPosition() {
      return this.x;
    }

    getYPosition() {
      return this.y;
    }

    getWidth() {
      return this.width;
    }

    getHeight() {
      return this.height;
    }
    
}