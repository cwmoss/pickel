import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";

export default class Number extends Input {
  // 2017-02-12T09:15:00Z ISO-8601
  get xhtml_value() {
    return ("" + this.value).substring(0, 10);
  }
  get_updated_data() {
    let val = "" + this.value;
    val = val.replaceAll(/[^0-9,]/g, "").replace(",", ".");
    console.log("+++ to_number", val);
    return parseFloat(val);
    //  return new Number(val);
  }
  xrender_input() {
    return html`<input
      @input=${(e) => this.input_event(e)}
      .value=${this.html_value}
      id="input"
      type="date"
      class="form-control"
    /> `;
  }
}

customElements.define("pi-number", Number);
