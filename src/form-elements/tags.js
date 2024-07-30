import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import Tagify from "../../vendor/tagify.m.js";
import ArrayContainer from "./array-container.js";
import { tagstyles } from "./tagify.css.js";
export default class Tags extends ArrayContainer {
  static styles = [tagstyles];
  after_init() {
    let inp = this.shadowRoot.querySelector("#tags");
    let taginput = new Tagify(inp);
  }
  render_actions() {
    return "";
  }
  render_els() {
    return html`<input
      type="text"
      name="tags"
      id="tags"
      value="zwo,drei, vier"
    />`;
  }

  createRenderRoot() {
    return LitElement.prototype.createRenderRoot.call(this);
  }
}

customElements.define("pi-tags", Tags);
