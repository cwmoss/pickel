import { LitElement, css, html } from "./../../vendor/lit-core.min.js";

export default class Switch extends LitElement {
  static formAssociated = true;
  static properties = {
    value: {},
    name: { reflect: true },
    label: {},
    id: {},
    on_label: {},
    off_label: {},
    opts: { attribute: false },
  };
  _value = "";
  constructor() {
    super();
    this.internals = this.attachInternals();
    this.on_label = "On";
    this.off_label = "Off";

    console.log("construct switch");
    // this.prefix = this.getAttribute("prefix");
    //this.schema = test;
  }

  set value(v) {
    this._value = v;
    this.internals.setFormValue(v);
  }
  get value() {
    return this._value;
  }

  input(e) {
    this.value = e.target.checked ? "on" : "off";
  }
  render() {
    console.log("render switch", this);
    return html`<link
        rel="stylesheet"
        href="${import.meta.url}/../variables.css"
        type="text/css"
      />
      <link
        rel="stylesheet"
        href="${import.meta.url}/../bs-only-form.css"
        type="text/css"
      />
      <style>
        .fgroup {
          margin-bottom: 1.5rem;
        }
      </style>
      <div class="fgroup">
        <div class="form-check form-switch">
          <input
            @click=${(e) => this.input(e)}
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
          />
          <label class="form-check-label" for="flexSwitchCheckDefault"
            >${this.label}:
            ${this.value == "off"
              ? this.off_label
              : this.value == "on"
              ? this.on_label
              : "-"}</label
          >
          <slot></slot>
        </div>
      </div>`;
  }
}

customElements.define("b-switch", Switch);
