import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

export default class Switch extends Face {
  static properties = { ...Face.properties, on_label: {}, off_label: {} };

  get_input_value(e) {
    // console.log(this.constructor.properties);
    return e.target.checked ? "on" : "off";
  }

  get_default_value() {
    return "off";
  }

  get_updated_data() {
    return this.value == "off" || !this.value ? false : true;
  }
  render() {
    console.log("render switch", this);
    return html`<div class="fgroup">
      <div class="form-check form-switch">
        <input
          @click=${(e) => this.input_event(e)}
          ?checked=${this.value == "on" || this.value === true}
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="check"
        />
        <label class="form-check-label" for="check"
          >${this.label}
          ${this.value == "off"
            ? this.off_label
            : this.value == "on"
            ? this.on_label
            : ""}</label
        >
        <slot></slot>
      </div>
    </div>`;
  }
}

customElements.define("b-switch", Switch);
