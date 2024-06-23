import { LitElement, css, html } from "./../vendor/lit-core.min.js";
import api from "../lib/slow-hand.js";
import schema from "../lib/schema.js";

import Container from "./form-elements/b_container.js";

export default class Editor extends LitElement {
  static properties = {
    /* das schema für den document _type */
    schema: { attribute: false },
    id: {},
    /* document _type */
    type: {},

    document: { type: Object },
    container: { type: Object, attribute: false },
  };

  _id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

  async connectedCallback() {
    super.connectedCallback();
    await this.load_schema();
  }

  async load_schema() {
    this.document = await api.document(this.id);
    this.type = this.document._type;
    if (!this.type) return;

    console.log("$$$ load schema", this.type, this._id, this.document);
    this.schema = schema.get_type(this.type);
    this.container = new Container();
    console.log("+++ container created");
    this.container.value = this.document;
    this.container.prefix = "";
    this.container.schemaid = this._id;
    this.container.level = 0;
    this.container.type = this.type;
  }
  updated(changedProperties) {
    if (changedProperties.has("type")) {
      this.load_schema();
    }
  }

  submit(e) {
    e.preventDefault();
    let data = this.container.get_updated_data();
    console.log("+++ save", data);

    return false;
  }
  // ${this.container}
  render() {
    console.log("render formbuilder", this.document, this.container);
    return html`<p>${this.type}</p>
      <form @submit=${this.submit}>
        <div class="actions">
          <button primary class="btn" part="button">Save</button>
        </div>
        ${this.container}
      </form>`;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define("sh-editor", Editor);
