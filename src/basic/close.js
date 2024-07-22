import { LitElement, css, html } from "../../vendor/lit-core.min.js";
/*
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
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
        font-size: 24px;
        color: #000;
        line-height: 0.8;
        content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmkteC1sZyIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNMi4xNDYgMi44NTRhLjUuNSAwIDEgMSAuNzA4LS43MDhMOCA3LjI5M2w1LjE0Ni01LjE0N2EuNS41IDAgMCAxIC43MDguNzA4TDguNzA3IDhsNS4xNDcgNS4xNDZhLjUuNSAwIDAgMS0uNzA4LjcwOEw4IDguNzA3bC01LjE0NiA1LjE0N2EuNS41IDAgMCAxLS43MDgtLjcwOEw3LjI5MyA4IDIuMTQ2IDIuODU0WiIvPgo8L3N2Zz4=");
        /*content: "\u00d7";*/ /* This will render the 'X' */
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
