import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Preview from "../slowhand/preview.js";
import Face from "./face.js";
import Search from "../slowhand/search.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../lib/util.js";

export default class Reference extends Face {
  static properties = {
    ...Face.properties,
    preview: { type: Object },
    schema: { type: Object },
    prefix: {},
  };

  async connectedCallback() {
    super.connectedCallback();
    await this.init();
  }

  set_schema(schema) {
    this.schema = schema;
    this.type = schema.type;
    this.supertype = schema.supertype;
  }

  async init() {
    // TODO: create new reference
    if (this.value == "") return;
    let doc = await api.document_preview(this.value._ref);
    console.log("$REF: doc-preview", this._name, this.value, doc);
    this.preview = new Preview();
    this.preview.set_data(doc);
    this.preview.icon = "file-earmark";
    const evt = new CustomEvent("preview-data", {
      detail: {
        name: this._name,
        title: this.preview.title,
        subtitle: this.preview.subtitle,
        media: this.preview.media,
      },
      bubbles: true,
      composed: true,
    });
    // this.requestUpdate();
    this.dispatchEvent(evt);
  }

  get allowed_type() {
    console.log("$REF", this._name, this.schema);
    return this.schema.to ? this.schema.to[0].type ?? "" : "";
  }
  async select(e) {
    e.stopPropagation();
    this.value = {
      _type: this.type,
      _ref: e.detail.id,
    };
    await this.init();
  }
  search() {}
  remove() {
    console.log("++remove REF");
    this.preview = null;
    this.value = {};
  }
  update_input(e) {
    console.log("+++ update", hashID(5), e, e.target.value);
    this.value.current = e.target.value;
  }
  render_search() {
    return html`<pi-search
      @open-doc=${this.select}
      .type=${this.allowed_type}
    ></pi-search>`;
  }
  render() {
    // if (!this._name) return;
    // if (!this.preview) return "";
    console.log("$REF render", this.schema);
    return html`<label>${this.label}</label>
      <div class="reference">
        ${this.preview ? this.preview : this.render_search()}
        <div class="actions">
          <pi-btn @click=${this.remove}>remove</pi-btn>
        </div>
      </div>`;
  }
}

customElements.define("pi-reference", Reference);
