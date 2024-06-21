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
    noLabel: { type: Boolean, attribute: "no-label" },
    inline: { type: Boolean },
    id: {},
    placeholder: {},
    originalType: {},
    // opts: { attribute: false },
  };

  static styles = [
    cssvars,
    bootstrapform,
    css`
      :host {
        display: block;
      }
      .fgroup {
        margin-bottom: 0;
      }
      button,
      *::part(button) {
        border-radius: 5px;
        border: 2px solid black;
        box-sizing: border-box;
        background-color: white;
        text-decoration: none;
        text-align: center;

        /* font-family: Helvetica;
  padding: 0.375em 0.5em 0.1875em;
  */
        padding: 0.375em 0.5em 0.4em;

        font-weight: 600;
        line-height: 1;
      }

      button[primary],
      *::part(btn-primary) {
        background: var(--color-accent);
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

  get_updated_data() {
    return this.value;
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
    e.stopPropagation();
    const evt = new Event("input", { bubbles: true, composed: true });
    this.dispatchEvent(evt);
  }
  get_input_value(e) {
    return e.target.value;
  }
  set opts(o) {
    Object.assign(this, o);
  }

  render_label() {
    return !this.noLabel
      ? html`<label for="input" class="form-label">${this.label}</label>`
      : "";
  }
}

// customElements.define("b-face", Face);
