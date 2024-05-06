export default class Index extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<h3>index</h3><a href="/about">about us</a>`;
  }
}

window.customElements.define("index-page", Index);
