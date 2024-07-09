import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
/*
https://stackoverflow.com/questions/67068455/how-can-i-access-the-unamed-slot-content-in-web-components
https://stackoverflow.com/questions/56351274/how-to-pass-option-tags-to-a-custom-element-as-distributed-nodes-aka-slot-sl
*/
export default class Select extends Face {
  static properties = {
    ...Face.properties,
    end: { type: Boolean },
    items: {
      type: Array,

      converter: (value, type) => {
        if (value.substring(0, 1) == "[") {
          return JSON.parse(value);
        } else {
          return value.split(",");
        }
        // return ["x", "y"];
      },
    },
    slotitems: { type: Array },
  };
  /*
  xxxxconstructor() {
    super();
    this.shadowRoot.addEventListener("slotchange", (e) => {
      console.log("slot changed");
    });
  }
  */
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

  get_default_value() {
    return "";
  }

  render() {
    let outp = html`<select
        ?end=${this.end}
        @change=${this.input_event}
        class="form-select"
        id="input"
      >
        ${this.items
          ? this.items.map(
              (item) =>
                html`
                  <option ?selected="${item == this.value}">${item}</option>
                `
            )
          : this.slotitems}
      </select>
      <slot></slot>`;

    return this.plain ? outp : this.wrap(outp);
  }
}

customElements.define("pi-select", Select);
