import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

export default class Input extends Face {
  static properties = {
    ...Face.properties,
    input_type: {},
    prefix: {},
    suffix: {},
    hasButtonSuffix: {},
  };

  connectedCallback() {
    super.connectedCallback();
    this.hasButtonSuffix = !!this.querySelector('[slot="suffix-button"]');
  }

  get native_type() {
    return this.input_type || "text";
  }
  render_input() {
    return html`<input
      @input=${(e) => this.input_event(e)}
      .value=${this.value}
      id="input"
      type="${this.native_type}"
      class="form-control"
    />`;
  }
  render() {
    return html`<div class="fgroup">
      <label for="input" class="form-label">${this.label}</label>
      <div class="input-group">
        ${this.prefix
          ? html` <span class="input-group-text">${this.prefix}</span> `
          : ""}
        ${this.render_input()}
        ${this.suffix
          ? html` <span class="input-group-text">${this.suffix}</span> `
          : ""}
        ${this.hasButtonSuffix ? html`<slot name="suffix-button"></slot>` : ""}
      </div>
      <slot name="footer"></slot>
      <div class="invalid-feedback"></div>
    </div>`;
  }
}

customElements.define("form-input", Input);
