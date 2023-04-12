class Data {
  constructor(inUrl, inKeys) {
    this.url = inUrl;
    this.keys = inKeys;
    this.content = [];
  }

  setContent(arr){
    this.content = new Array(arr.length);
    this.content = arr;
  }

  getContent(i) {
    return this.content[i];
  }

  printContent(i) {
    console.log(this.getContent(i));
  }

  printAllContent() {
    this.content.forEach((index) => {
      console.log(index);
    });
  }
}