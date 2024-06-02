//const config = require('../../slowhand.json');
import config from "../../slowhand.json.js";

class Datasets {
  constructor() {
    this._datasets = [];
    this._current = null;
    if (Array.isArray(config.dataset)) {
      throw "invalid config: 'dataset' should not be an array. Use 'datasets' instead";
    }
    if (config.dataset) {
      localStorage.setItem("dataset", config.dataset);
      this._datasets.push(config.dataset);
      this._current = config.dataset;
    } else if (config.datasets) {
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
      location.reload();
    }
  }

  get datasets() {
    return this._datasets;
  }
}

export default new Datasets();
