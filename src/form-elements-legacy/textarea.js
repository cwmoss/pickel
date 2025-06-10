import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

export default class Textarea extends Face {
  static properties = { ...Face.properties, size: {} };

  render() {
    let [cols, rows] = (this.size || "").split("x", 2);
    return html`<div class="fgroup">
      <label for="text" class="form-label">${this.label}</label>
      <textarea
        @input=${(e) => this.input_event(e)}
        @focusout=${this.validate_event}
        class="form-control"
        placeholder="${this.placeholder ?? ""}"
        cols="${cols ?? 50}"
        rows="${rows ?? 5}"
        id="text"
      >
${this.value}</textarea
      >
      <slot name="footer"></slot>
      <div class="invalid-feedback">${this.error_message}</div>
    </div>`;
  }
}

customElements.define("b-textarea", Textarea);
