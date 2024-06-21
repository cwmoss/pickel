import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

export default class Output extends Face {
  static properties = { ...Face.properties, prefix: {}, suffix: {} };

  render() {
    return html`<div>
      <output
        >${this._name} // ${this.originalType}:
        ${JSON.stringify(this.value)}</output
      >
    </div>`;
  }
}

customElements.define("pi-output", Output);
