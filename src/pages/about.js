import PageElement from "../lib/page_element.js";
export default class About extends PageElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<h3>about</h3><a href="/">back</a>`;
  }
}

window.customElements.define("about-page", About);
