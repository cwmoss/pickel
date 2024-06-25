import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import { add_style, once } from "../lib/util.js";

let add_style_once = once(add_style);
let styles = /*css*/ `
dialog {
  margin: 2rem auto;
  border: none !important;
  border-radius: calc(5px * var(--ratio));
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.6rem;
  max-width: 400px;
}

::backdrop {
  background-image: linear-gradient(
    45deg,
    magenta,
    rebeccapurple,
    dodgerblue,
    green
  );
  opacity: 0.75;
}
`;

export default class Dialog extends LitElement {
  static properties = {
    title: {},
    trigger_title: {},
    content: { type: Object },
  };

  constructor() {
    super();
    add_style_once(styles);
  }
  connectedCallback() {
    // super();
    super.connectedCallback();
    window.setTimeout(() => {
      this.template = this.children[0];
      console.log("dialog content", this.template);
      this.content = this.template;
      // this.innerHTML = "";
    }, 100);
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
