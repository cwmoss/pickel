//const config = require('../../slowhand.json');
// import config from "../../slowhand.json.js";
let config = {
  datasets: null,
  dataset: null,
};

class Datasets {
  constructor() {
    this._datasets = [];
    this._current = null;
  }

  init() {
    if (Array.isArray(config.dataset)) {
      throw "invalid config: 'dataset' should not be an array. Use 'datasets' instead";
    }
    if (config.dataset) {
      localStorage.setItem("dataset", config.dataset);
      this._datasets.push(config.dataset);
      this._current = config.dataset;
    } else if (config.datasets.length) {
      this._datasets = config.datasets;
      const dataset = localStorage.getItem("dataset");
      if (dataset && this._datasets.includes(dataset)) {
        this._current = dataset;
      } else {
        this._current = this._datasets[0];
      }
    }
  }

  get current() {
    return this._current;
  }

  set current(dataset) {
    if (this._datasets.includes(dataset)) {
      this._current = dataset;
      localStorage.setItem("dataset", dataset);
      location.replace("/desk");
    }
  }

  get datasets() {
    return this._datasets;
  }
  set datasets(ds) {
    config.datasets = ds;
    this.init();
  }
}

export default new Datasets();
