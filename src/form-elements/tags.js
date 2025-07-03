import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import Tagify from "../../vendor/tagify.m.js";
import Face from "./face.js";
import { tagstyles } from "./tagify.css.js";

let styles = css`
  .custom {
    --tags-border-color: var(--bs-border-color);
  }
  .tagify {
    border-width: var(--bs-border-width);
    border-radius: var(--bs-border-radius);
  }
`;

export default class Tags extends Face {
  static styles = [...Face.styles, tagstyles, styles];

  get_input_value(e) {
    console.log("get select value", this.value, e.target.value);
    return this.tagify.value.map((item) => item.value);
  }

  firstUpdated() {
    let inp = this.shadowRoot.querySelector("#tags");
    this.tagify = new Tagify(inp);
    //tagify.addTags(this.value);
  }
  render() {
    return html`${this.render_label()}<input
        type="text"
        class="form-control custom"
        name="tags"
        id="tags"
        .value=${this.value}
        @change=${this.input_event}
      />`;
  }

  xxxcreateRenderRoot() {
    return LitElement.prototype.createRenderRoot.call(this);
  }
}

customElements.define("pi-tags", Tags);
