class Data {
  constructor(inUrl, inKeys) {
    this.url = inUrl;
    this.keys = inKeys;
    this.content = new Array(200);
  }

  initiateLoading() {
    loadJSON(this.url, this.loadData);
  }

  loadData(json) {
    //this.content = new Array(Number(json.meta["total"]));

    for (var i = 1; i < Number(json.meta["last_page"]) - 1; i++) {
      loadJSON(this.url + "?page=" + i, this.loadDataCluster);
    }
  }

  loadDataCluster(json) {
    const contentIndex = Number(json.meta["from"]) - 1;

    for (var i = 0; i < Number(json.meta["per_page"]); i++) {
      var obj = {};

      this.keys.forEach((key) => {
        obj[key] = json.data[i][key];
      });

      this.content[i].push(obj);
    }
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
