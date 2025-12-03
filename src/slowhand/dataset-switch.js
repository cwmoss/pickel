import { LitElement, css, html } from "../../vendor/lit-core.min.js";

import dataset from "../lib/datasets.js";
import project from "../lib/project.js";

export default class DatasetSwitch extends LitElement {
  loaded = false;
  static properties = {
    current: {},
    datasets: { type: Array },
  };

  async connectedCallback() {
    super.connectedCallback();
    if (this.loaded) return;
    this.initialize();
  }

  initialize() {
    this.loaded = true;
    // this.current = dataset.current;
    let schema = project.schema();
    this.current = schema.name;
    this.datasets = project.datasets();
    console.log("$schemaswitch all datasets", this.current, this.datasets);
  }

  switch(e) {
    console.log("+++ switch to", e.target.value, e);
    dataset.current = e.target.value; //e.originalTarget.value;
  }

  render() {
    return html`<pi-select
      no-label
      @pi-input=${this.switch}
      .value=${this.current}
      .items=${this.datasets}
    ></pi-select>`;
  }
}

window.customElements.define("dataset-switch", DatasetSwitch);
