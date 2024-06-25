import { LitElement, css, html } from "../../vendor/lit-core.min.js";

import dataset from "../lib/datasets.js";

export default class DatasetSwitch extends LitElement {
  static properties = {
    current: {},
  };

  connectedCallback() {
    super.connectedCallback();
    this.current = dataset.current;
  }

  switch(e) {
    console.log("+++ switch to", e.target.value, e);
    dataset.current = e.target.value; //e.originalTarget.value;
  }

  render() {
    return html`<pi-select
      no-label
      @input=${this.switch}
      .value=${this.current}
      .items=${dataset.datasets}
    ></pi-select>`;
  }
}

window.customElements.define("dataset-switch", DatasetSwitch);
