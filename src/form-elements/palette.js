import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import teststring from "./test.html.js";

console.log("+++ test???", teststring);

let rstyles = css`
  section {
    background-color: #eee;
    line-height: 0;
    padding: 0.5rem;
  }
  label {
    position: relative;
    color: grey;
    padding: 0 0.25rem;
    /* transition: color 0.15s; */
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
  label span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
  }
  label:has(input) {
    padding: 2px;
    margin-right: 0.5rem;
    line-height: 0;
  }
  label:has(input):last-child {
    margin-right: 0;
  }
  /* Add an outline when the input is focused via the keyboard */
  label:has(input:focus-visible) {
    outline: black solid 2px;
  }

  /* Color Adjustments when the input is checked, hovered, or active */
  /* checked */
  label:is(:has(input:checked)) {
    outline: 2px solid black;
  }

  /* hover */
  label:is(:has(input:hover)) {
    outline: 2px solid darkgoldenrod;
  }

  /* we need to duplicate the :active identifier, so that the specificity of the selector is higher than the ones from before */
  label:has(input:active) {
    outline: 2px solid darkgoldenrod;
  }
`;

export default class Palette extends Face {
  static styles = [...Face.styles, rstyles];
  colors = ["violet", "indigo", "blue", "green", "yellow", "orange", "red"];
  get xhtml_value() {
    return ("" + this.value).substring(0, 10);
  }

  static validate_on_input = true;

  xget_input_value(e) {
    console.log("new value", e.target.value, parseFloat(e.target.value));
    return parseFloat(e.target.value);
  }

  render_label() {
    return !this.noLabel && !this.plain
      ? html`<div class="form-label">${this.label}</div>`
      : "";
  }
  render() {
    return html`
      ${this.render_label()}
      <section>
        ${this.colors.map((val) => {
          return html`<label
            ><input
              type="radio"
              name="palette-index"
              value=${val}
              @change=${this.input_event}
              ?checked="${val == this.value}" />
            <span style="background-color:${val};"></span
          ></label>`;
        })}
      </section>
      <div class="invalid-feedback">${this.error_message}</div>
    `;
  }
}

customElements.define("pi-palette", Palette);
