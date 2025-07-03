import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

export default class Button extends Face {
  static properties = { ...Face.properties, prefix: {}, suffix: {} };

  render() {
    return html`<div>
      <button><slot></slot></button>
    </div>`;
  }
}

customElements.define("pi-button", Button);
