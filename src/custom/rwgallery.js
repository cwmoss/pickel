import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import ArrayContainer from "../form-elements/arraycontainer.js";
export default class CustomRwGallery extends ArrayContainer {
  static properties = {
    value: { type: Object },
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
    return html`<p><span>spezialgallery</span></p>`;
  }
}

window.customElements.define("custom-rwgallery", CustomRwGallery);
