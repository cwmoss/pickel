import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
/*
https://stackoverflow.com/questions/67068455/how-can-i-access-the-unamed-slot-content-in-web-components
https://stackoverflow.com/questions/56351274/how-to-pass-option-tags-to-a-custom-element-as-distributed-nodes-aka-slot-sl
*/
export default class Select extends Face {
  static properties = {
    ...Face.properties,
    items: { type: Array },
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
    // console.log(this.constructor.properties);
    return e.target.value;
  }

  get_default_value() {
    return "";
  }

  render() {
    console.log("render switch", this);
    return html`<div class="fgroup">
      <label for="input" class="form-label">${this.label}</label>
      <select
        @change=${(e) => this.input_event(e)}
        class="form-select"
        id="select"
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
      <slot></slot>
    </div>`;
  }
}

customElements.define("b-select", Select);
