import { LitElement, css, html } from "./../../vendor/lit-core.min.js";

export default class Dialog extends LitElement {
  static properties = {
    title: {},
    trigger_title: {},
  };

  constructor() {
    super();
    // super.connectedCallback();
    this.template = this.children[0];
    console.log("dialog content", this.template.content);
    this.content = this.template.content;
    this.innerHTML = "";
  }
  get dialog() {
    return this.renderRoot?.querySelector("dialog") ?? null;
  }

  open() {
    this.dialog.showModal();
  }
  close() {
    this.dialog.close();
  }

  render() {
    console.log("render dialog", this.content);
    return html`<button @click=${() => this.open()}>
        ${this.trigger_title}
      </button>
      <dialog>
        <h1>
          ${this.title}
          <a href="javascript:;" @click=${() => this.close()}>x</a>
        </h1>
        ${this.content}
      </dialog>`;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define("b-dialog", Dialog);
