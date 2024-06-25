import Validator from "./st.bernard.js";

export default class ValidatorElement extends HTMLElement {
  connectedCallback() {
    this.submitted = false;
    this.form_el = this.querySelector("form");
    let rules = JSON.parse(this.dataset.rules);
    let messages = JSON.parse(this.dataset.messages);
    this.v = new Validator(this.form_el, rules, messages);
    console.log("+++ ValidatorElement", rules);
    this.wait = this.getAttribute("wait");
    this.form_el.addEventListener("submit", (e) => this.handle_submit(e));
  }

  async handle_submit(e) {
    if (this.submitted) {
      e.preventDefault();
      return false;
    }
    let ok = await this.v.validate_all(e);
    if (!ok) {
      e.preventDefault();
    } else {
      this.submitted = true;
      this.form_el.classList.add("is-submitting");
      if (this.wait) {
        const modal = document.querySelector(this.wait);
        if (modal) {
          const wait = new bootstrap.Modal(modal);
          wait.show();
        }
      }
    }
  }
}
