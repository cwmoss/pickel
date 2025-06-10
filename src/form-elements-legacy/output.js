import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import api from "../lib/api.js";

export default class Output extends Face {
  static properties = { ...Face.properties, prefix: {}, suffix: {} };

  render() {
    let val = JSON.stringify(this.value);
    let block;
    if (this.originalType == "text") block = api.block_to_text(this.value);
    if (block) val = block;
    return html`<div>
      <output
        ><strong>${this._name}</strong> // ${this.originalType}: ${val}</output
      >
    </div>`;
  }
}

customElements.define("pi-output", Output);
