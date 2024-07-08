import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Preview from "../slowhand/preview.js";
import Face from "./face.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../lib/util.js";

export default class Reference extends Face {
  static properties = { ...Face.properties, preview: { type: Object } };

  async connectedCallback() {
    super.connectedCallback();
    await this.init();
  }

  async init() {
    // TODO: create new reference
    if (this.value == "") return;
    let doc = await api.document_preview(this.value._ref);
    console.log("doc:", this.value, doc);
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
    this.dispatchEvent(evt);
  }

  update_input(e) {
    console.log("+++ update", hashID(5), e, e.target.value);
    this.value.current = e.target.value;
  }
  render() {
    if (!this.preview) return "";
    console.log("render reference");
    return html`<label>${this.label}</label>
      ${this.preview} `;
  }
}

customElements.define("pi-reference", Reference);
