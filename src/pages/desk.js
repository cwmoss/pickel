import PageElement from "../lib/page_element.js";

export default class Desk extends PageElement {
  get title() {
    return "Desk";
  }
}

window.customElements.define("desk-page", Desk);
