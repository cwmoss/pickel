import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
// import cssvars from "./variables.css.js";
import { bootstrapform } from "./bs-only-form.css.js";
import FieldValidator from "../st.bernard/field-validator.js";
// console.log("bootstrap import", cssvars);

export default class Face extends LitElement {
  static formAssociated = true;

  static properties = {
    value: { noAccessor: true },
    name: { reflect: true },
    label: {},
    noLabel: { type: Boolean, attribute: "no-label" },
    plain: { type: Boolean },
    inline: { type: Boolean },
    id: {},
    placeholder: {},
    originalType: {},
    options: { type: Object, attribute: false, noAccessor: true },
    initialValue: { noAccessor: true },
    is_fresh: { type: Boolean, state: true },
    is_valid: { type: Boolean, state: true },
    error_message: {},
    // rules: { type: Array },
    // opts: { attribute: false },
  };

  static styles = [
    // cssvars,
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

        height: fit-content;
        font-weight: 600;
        line-height: 1;
      }

      button[primary],
      *::part(btn-primary) {
        background: var(--color-accent);
      }
      select[end] {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: 0;
      }
      label,
      div.form-label {
        /* font-weight: 600; */
      }
      div.form-label:empty {
        display: none;
        margin-bottom: 0;
      }
      label.form-check-label {
        /* font-weight: normal; */
      }

      .input-group {
        /*gap: 0.5rem;*/
      }
      .input-group:has([decostart]) {
        position: relative;
      }
      [decostart] {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 11;
      }
      .input-group:has([decostart]) input {
        padding-left: 30px;
      }
      .reference {
        display: flex;
        gap: 1rem;
      }
      .reference > *:first-child {
        width: 100%;
      }
      .reference .actions {
        width: 100px;
        min-width: 0;
      }
      .invalid-feedback {
        display: block;
      }
      .invalid-feedback:empty {
        display: none;
      }
    `,
  ];

  constructor() {
    super();
    this.is_fresh = true;
    this.is_valid = true;
    this.internals = this.attachInternals();
    // this.internals.setFormValue(this.value);
  }

  get_default_value() {
    console.log("$FACE default value", this.initialValue, this.name);
    return this.initialValue;
  }

  get_updated_data() {
    return this.value;
  }

  is_empty() {
    return !this.value || this.value == "";
  }
  /*
  set value(v) {
    console.log("++FACE set value", v);
    this.internals.setFormValue(v);
  }
  */

  _value = "";

  set value(val) {
    if (!val) val = this.get_default_value();
    this._value = val;
  }
  get value() {
    return this._value;
  }

  _opts = {};
  set options(opts) {
    console.log("$FACE set options", opts, this.name);
    if (opts) this._opts = opts;
  }
  get options() {
    return this._opts;
  }

  _initialValue = "";
  set initialValue(val) {
    console.log("$FACE set initialValue", val, this.name);
    if (val) this._initialValue = val;
  }
  get initialValue() {
    return this._initialValue;
  }
  updated(changedProperties) {
    if (changedProperties.has("value")) {
      this.internals.setFormValue(this.value);
    }
  }
  input_event(e) {
    console.log("static fresh", this.constructor.validate_on_input);
    this.is_fresh = false;
    this.value = this.get_input_value(e);
    if (this.constructor.validate_on_input) {
      this.validate_event();
    }
    //e.stopPropagation();
    const evt = new CustomEvent("pi-input", {
      detail: this.value,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }
  get_input_value(e) {
    return e.target.value;
  }
  /*
  TODO: clarify opts vs options
  */
  set opts(o) {
    Object.assign(this, o);
    if (o.title) this.label = o.title;
  }
  set_options(o) {
    this.options = o ? o : {};
  }
  set_validation(rules) {
    this.validator = new FieldValidator(rules);
  }

  validate_sync() {
    if (!this.validator) return true;
    this.is_fresh = false;
    let val = this.get_updated_data();
    let ok = this.validator.validate_sync(val, this);
    if (ok === true) {
      this.is_valid = true;
      this.error_message = "";
    } else {
      this.is_valid = false;
      this.error_message = ok;
    }
    console.log("validation result", ok);
    return ok;
  }

  async validate() {
    if (!this.validator) return true;
    let val = this.get_updated_data();
    let ok = await this.validator.validate(val, this);
    if (ok === true) {
      this.is_valid = true;
      this.error_message = "";
    } else {
      this.is_valid = false;
      this.error_message = ok;
    }
    console.log("validation result", ok);
    return ok;
  }
  async validate_event() {
    if (this.is_fresh) {
      return true;
    }
    return await this.validate();
  }
  wrap(h) {
    return html`<div class="fgroup">${h}</div>`;
  }

  render_label() {
    return !this.noLabel && !this.plain
      ? html`<label for="input" class="form-label">${this.label}</label>`
      : "";
  }
}

// customElements.define("b-face", Face);
