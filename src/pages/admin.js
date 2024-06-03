import PageElement from "../lib/page_element.js";

export default class Admin extends PageElement {
  get title() {
    return "Admin";
  }
}

window.customElements.define("admin-page", Admin);
