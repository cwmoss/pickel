import PageElement from "../lib/page_element.js";

export default class Index extends PageElement {
  get title() {
    return "Homepage";
  }
}

window.customElements.define("index-page", Index);
