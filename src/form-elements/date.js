import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";

export default class Date extends Input {
  // 2017-02-12T09:15:00Z ISO-8601
  get html_value() {
    return ("" + this.value).substring(0, 10);
  }
  render_input() {
    return html`<input
      @input=${(e) => this.input_event(e)}
      .value=${this.html_value}
      id="input"
      type="date"
      class="form-control"
    /> `;
  }
}

customElements.define("pi-date", Date);
