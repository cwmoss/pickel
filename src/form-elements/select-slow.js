import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
/*
https://stackoverflow.com/questions/67068455/how-can-i-access-the-unamed-slot-content-in-web-components
https://stackoverflow.com/questions/56351274/how-to-pass-option-tags-to-a-custom-element-as-distributed-nodes-aka-slot-sl
*/
export default class SelectSlow extends Face {
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

    /*
        alternativ assignments abarten
   
    this.shadowRoot.addEventListener("slotchange", (e) => {
      console.log("slot changed", e);
      if (!this.slotitems) this.slotitems = [];
      let node = this.querySelector("option");
      this.slotitems.push(node);
      this.requestUpdate();
    });
    */
  }

  get_input_value(e) {
    console.log("get select value", this.value, e.target.value);
    return e.target.value;
  }

  render() {
    let outp = html`${this.render_label()}<select
        ?end=${this.end}
        @change=${this.input_event}
        class="form-select"
        id="input"
      >
        ${this.options?.list
          ? this.options.list.map(
              (item) =>
                html`
                  <option
                    ?selected="${item.value == this.value}"
                    .value=${item.value}
                  >
                    ${item.title}
                  </option>
                `
            )
          : this.slotitems}
      </select>
      <slot></slot>`;

    return this.plain ? outp : this.wrap(outp);
  }
}

customElements.define("pi-select-slow", SelectSlow);
