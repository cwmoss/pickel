import converter from "./lib/number_conversion.js";

export default class EurocentInput extends HTMLElement {
  connectedCallback() {
    let input = this.querySelector("input");
    input.addEventListener("blur", () => this.update(input));
    this.update(input);
  }

  update(input) {
    if (this.is_valid(input.value)) {
      let value = this.to_number(input.value);
      input.value = this.to_local(value);
    }
  }

  to_local(numberval) {
    return converter.to_local(numberval);
  }

  to_number(stringval) {
    return converter.to_number(stringval);
  }

  is_valid(stringval) {
    return converter.is_valid(stringval);
  }
}
