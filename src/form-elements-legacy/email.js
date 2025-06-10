import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";

export default class Email extends Input {
  render_input() {
    return html`<input
      @input=${(e) => this.input_event(e)}
      .value=${this.value}
      id="input"
      type="email"
      class="form-control"
    /> `;
  }
}

customElements.define("pi-email", Email);
