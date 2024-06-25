import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import { add_style, once } from "../../lib/util.js";

let add_style_once = once(add_style);
let styles = css`
  dialog {
    margin: 2rem auto;
    border: none !important;
    border-radius: calc(5px * var(--ratio));
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 1.6rem;
    max-width: 400px;
  }
  * {
    box-sizing: border-box;
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
  h1 {
    display: flex;
    margin: 0;
  }
`;

export default class Dialog extends LitElement {
  static properties = {
    title: {},
    trigger_title: {},
    content: { type: Object },
  };
  static styles = styles;

  get dialog() {
    return this.renderRoot?.querySelector("dialog") ?? null;
  }

  open() {
    this.dialog.showModal();
  }
  close() {
    this.dialog.close();
  }
  // <button close type="button" @click=${this.close}></button>
  render() {
    console.log("render dialog", this.content);
    return html`<button part="button" @click=${this.open}>
        ${this.trigger_title}
      </button>
      <dialog>
        <pi-close @click=${this.close}></pi-close>
        <h1>
          <div>${this.title}</div>
        </h1>
        <slot></slot>
      </dialog>`;
  }
}

customElements.define("b-dialog", Dialog);