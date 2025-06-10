import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";

export default class Url extends Input {
  render_extra() {
    if (!this.value) return "";
    return html`<p><a href=${this.value} target="_blank">visit</a></p>`;
  }
  render_input() {
    return html`<input
      @input=${(e) => this.input_event(e)}
      .value=${this.value}
      id="input"
      type="url"
      class="form-control"
    /> `;
  }
}

customElements.define("pi-url", Url);
