import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import cssvars from "./variables.css.js";
import { bootstrapform } from "./bs-only-form.css.js";

// console.log("bootstrap import", cssvars);

export default class Face extends LitElement {
  static formAssociated = true;

  static properties = {
    value: {},
    name: { reflect: true },
    label: {},
    id: {},
    placeholder: {},
    // opts: { attribute: false },
  };

  static styles = [
    cssvars,
    bootstrapform,
    css`
      .fgroup {
        margin-bottom: 0;
      }
    `,
  ];

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.value = this.get_default_value();
    this.internals.setFormValue(this.value);
  }

  get_default_value() {
    //onsole.log("FACE value",this )
    return "";
  }
  /*
  set value(v) {
    console.log("++FACE set value", v);
    this.internals.setFormValue(v);
  }
  */
  updated(changedProperties) {
    if (changedProperties.has("value")) {
      this.internals.setFormValue(this.value);
    }
  }
  input_event(e) {
    this.value = this.get_input_value(e);
  }
  get_input_value(e) {
    return e.target.value;
  }
  set opts(o) {
    Object.assign(this, o);
  }
}

// customElements.define("b-face", Face);
