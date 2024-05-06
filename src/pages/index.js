import PageElement from "../lib/page_element.js";

export default class Index extends PageElement {
  connectedCallback() {
    this.innerHTML = `<h3>index</h3><a href="/about">about us</a>`;
  }
}

window.customElements.define("index-page", Index);
