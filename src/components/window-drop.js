import { LitElement, css, html } from "./../vendor/lit-core.min.js";

export default class WindowDrop extends LitElement {
  constructor() {
    super();
    window.addEventListener("dragenter", this.enter);
    window.addEventListener("dragover", this.enter);
    window.addEventListener("dragleave", this.leave);
    window.addEventListener("drop", this.drop);
  }

  drop(e) {
    console.log("++ dropped", e);
    e.preventDefault();
    document.querySelector("body").classList.remove("dragging");
  }

  enter(e) {
    e.preventDefault();
    console.log("++ drag over");
    document.querySelector("body").classList.add("dragging");
  }

  leave() {
    console.log("++ drag leave");
    document.querySelector("body").classList.remove("dragging");
  }
  render() {
    return html`<multi-upload></multi-upload>`;
  }
}

customElements.define("window-drop", WindowDrop);
