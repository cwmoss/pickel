import { LitElement, css, html } from "../../vendor/lit-core.min.js";

export default class Close extends LitElement {
  static properties = {
    absolute: { type: Boolean },
    size: {},
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
      }
      button {
        position: absolute;
        top: 0;
        right: 6px;
        appearance: none;
        border: 0px;
        background: white;
      }
      button:after {
        display: inline-block;
        font-size: 2rem;
        color: #aaa;
        content: "\u00d7"; /* This will render the 'X' */
      }
    `,
  ];

  // @click=${this.close}
  render() {
    return html`<button type="button"></button>`;
  }
}

window.customElements.define("pi-close", Close);
