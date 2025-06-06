import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import { add_style, once } from "../lib/util.js";

let add_style_once = once(add_style);
let styles = css`
  * {
    box-sizing: border-box;
  }

  dialog {
    margin: 2rem auto;
    border: none !important;
    border-radius: var(--overlay-border-radius); /*calc(5px * var(--ratio));*/
    box-shadow: var(--overlay-box-shadow);
    padding: 1.6rem;
    width: 90%;
    height: 90%;
    overflow: auto;

    transition: display 1s allow-discrete, overlay 1s allow-discrete;

    animation: close 0.5s forwards;
    &[open] {
      animation: open 0.5s forwards;
    }
  }

  @keyframes open {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes close {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
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
    nobutton: { type: Boolean },
    content: { type: Object },
    open: { type: Boolean },
    isopen: { type: Boolean, state: true },
  };
  static styles = styles;

  get dialog() {
    return this.renderRoot?.querySelector("dialog") ?? null;
  }

  /*
    automatically open the dialog, when open attribute is present
  */
  firstUpdated() {
    if (this.open) {
      this.isopen = true;
      this.dialog.showModal();
    }
  }
  open_dialog() {
    this.isopen = true;
    this.dialog.showModal();
  }
  close_dialog() {
    this.dialog.close();
  }
  maybe_close(e) {
    if (e.target.hasAttribute("close")) {
      this.dialog.close();
    }
  }
  close(e) {
    e.stopPropagation();
    this.dialog.close();
  }
  // <button close type="button" @click=${this.close}></button>
  render() {
    console.log("render dialog", this.content);
    return html`<slot name="button" @click=${this.open_dialog}
        >${this.nobutton
          ? ""
          : html`<pi-btn
              flat
              icon="info"
              title=${this.trigger_title}
            ></pi-btn>`}</slot
      >
      <dialog @click=${this.maybe_close}>
        <pi-close @click=${this.close}></pi-close>
        <h1>
          <div>${this.title}</div>
        </h1>
        <slot @close-dialog=${this.close}></slot>
        <slot name="footer"></slot>
      </dialog>`;
  }
}

customElements.define("pi-dialog", Dialog);
