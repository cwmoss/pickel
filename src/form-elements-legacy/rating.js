import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

let rstyles = css`
  label {
    position: relative;
    color: grey;
    padding: 0 0.25rem;
    transition: color 0.15s;
  }

  /* Position the invisible input on top of the label */
  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    /* CSS reset */
    margin: 0;
  }

  /* Add an outline when the input is focused via the keyboard */
  label:has(input:focus-visible) {
    outline-offset: 1px;
    outline: black solid 2px;
  }

  /* Color Adjustments when the input is checked, hovered, or active */
  /* checked */
  label:is(:has(> input:checked), :has(~ label > input:checked)) {
    color: gold;
  }

  /* hover */
  label:is(:has(> input:hover), :has(~ label > input:hover)) {
    color: goldenrod;
  }

  /* we need to duplicate the :active identifier, so that the specificity of the selector is higher than the ones from before */
  label:has(input:active):has(input:active) {
    color: darkgoldenrod;
  }
`;

export default class Rating extends Face {
  static styles = [...Face.styles, rstyles];
  max = 5;
  get xhtml_value() {
    return ("" + this.value).substring(0, 10);
  }

  static validate_on_input = true;

  get_input_value(e) {
    console.log("new value", e.target.value, parseFloat(e.target.value));
    return parseFloat(e.target.value);
  }

  xxxget_updated_data() {
    let val = "" + this.value;
    val = val.replaceAll(/[^0-9,]/g, "").replace(",", ".");
    console.log("+++ to_number", val);
    return parseFloat(val);
    //  return new Number(val);
  }
  render_label() {
    return !this.noLabel && !this.plain
      ? html`<div class="form-label">${this.label}</div>`
      : "";
  }
  render() {
    return html`
      ${this.render_label()}
      ${[...Array(this.max).keys()].map((val) => {
        return html`<label>
          <input
            type="radio"
            name="star-rating"
            value=${val + 1}
            @change=${this.input_event}
            ?checked="${val + 1 == this.value}"
          />
          <span>★</span>
        </label>`;
      })}
      <div class="invalid-feedback">${this.error_message}</div>
    `;
  }
}

customElements.define("pi-rating", Rating);
