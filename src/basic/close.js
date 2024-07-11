import { LitElement, css, html } from "../../vendor/lit-core.min.js";
/*
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
*/
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
        top: 8px;
        right: 6px;
        appearance: none;
        border: 0px;
        background: white;
      }
      button:after {
        display: inline-block;
        font-size: 2rem;
        color: #333;
        line-height: 0.8;
        content: "\u00d7"; /* This will render the 'X' */
      }
      button:hover {
        background: #eee;
      }
    `,
  ];

  // @click=${this.close}
  render() {
    return html`<button type="button"></button>`;
  }
}

window.customElements.define("pi-close", Close);
