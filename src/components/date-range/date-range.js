import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
// import * as fecha from "./fetcha.min.js";
import HotelDatepicker from "./hotel-datepicker.esm.js";
//import { bootstrapform } from "./bs-only-form.css.js";

// console.log("bootstrap import", cssvars);

export default class DateRange extends LitElement {
  static properties = {
    picker: {},
  };

  constructor() {
    super();
    this.input = document.createElement("input");
    this.picker = new HotelDatepicker(this.input);
  }

  render() {
    return this.input;
  }
}

customElements.define("b-date-range", DateRange);
