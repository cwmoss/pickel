import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import { slugify_simple } from "../lib/util.js";
/*
https://stackoverflow.com/questions/67068455/how-can-i-access-the-unamed-slot-content-in-web-components
https://stackoverflow.com/questions/56351274/how-to-pass-option-tags-to-a-custom-element-as-distributed-nodes-aka-slot-sl
*/
export default class Checks extends Face {
  static properties = {
    ...Face.properties,
    end: { type: Boolean },
    list: {
      type: Array,
    },
    slotitems: { type: Array },
  };

  connectedCallback() {
    super.connectedCallback();

    let slots_all = this.querySelectorAll("option");
    // console.log(slots_all);
    if (slots_all.length)
      slots_all.forEach((opt) => {
        if (opt.value == this.value) opt.setAttribute("selected", "");
        this.slotitems = slots_all;
      });
  }

  get_input_value(e) {
    let val = [...this.shadowRoot.querySelectorAll(":checked")].map(
      (e) => e.value
    );
    console.log("get select value", this.value, e.target.value, val);
    return val;
  }

  get_default_value() {
    return [];
  }

  render_label() {
    return !this.noLabel && !this.plain
      ? html`<div class="form-label">${this.label}</div>`
      : "";
  }

  render() {
    let outp = html`${this.render_label()}
      
        ${
          this.options?.list
            ? this.options.list.map(
                (item) =>
                  html`<div
                    class="form-check ${this.options?.direction == "horizontal"
                      ? "form-check-inline"
                      : ""}"
                  >
                    <input
                      type="checkbox"
                      name="check[]"
                      class="form-check-input"
                      @change=${this.input_event}
                      ?checked="${this.value.includes(item.value)}"
                      .value=${item.value}
                      id="${slugify_simple(item.value)}"
                    />
                    <label
                      class="form-check-label"
                      for="${slugify_simple(item.value)}"
                      >${item.title}</label
                    >
                  </div> `
              )
            : this.slotitems
        }
      </div>
      <slot></slot>`;

    return this.plain ? outp : this.wrap(outp);
  }
}

customElements.define("pi-checks", Checks);
