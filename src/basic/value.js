import { LitElement, css, html } from "../../vendor/lit-core.min.js";

export default class Value extends LitElement {
  static properties = {
    data: {},
  };

  static styles = [
    // cssvars,
    css`
      :host {
      }
      span {
      }
    `,
  ];

  render() {
    //    if (!this.data) return "";
    return html`<slot><span>${this.data}</span></slot>`;
  }
}

window.customElements.define("pi-value", Value);
