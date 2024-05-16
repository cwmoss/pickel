import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";

export default class Switch extends Face {
  static properties = { ...Face.properties, on_label: {}, off_label: {} };

  get_input_value(e) {
    // console.log(this.constructor.properties);
    return e.target.checked ? "on" : "off";
  }

  render() {
    console.log("render switch", this);
    return html`<div class="fgroup">
      <div class="form-check form-switch">
        <input
          @click=${(e) => this.input_event(e)}
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
            : ""}</label
        >
        <slot></slot>
      </div>
    </div>`;
  }
}

customElements.define("b-switch", Switch);
