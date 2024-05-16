import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import cssvars from "./variables.css.js";
import { bootstrapform } from "./bs-only-form.css.js";

console.log("bootstrap import", cssvars);
export default class Face extends LitElement {
  static formAssociated = true;

  static properties = {
    value: {},
    name: { reflect: true },
    label: {},
    id: {},
    opts: { attribute: false },
  };

  static styles = [
    cssvars,
    bootstrapform,
    css`
      .fgroup {
        margin-bottom: 1.5rem;
      }
    `,
  ];

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  input_event(e) {
    this.value = this.get_input_value(e);
    this.internals.setFormValue(this.value);
  }
  get_input_value(e) {
    return e.target.value;
  }
}

customElements.define("b-face", Face);
