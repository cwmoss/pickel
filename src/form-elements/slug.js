import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";
import Face from "./face.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../lib/util.js";

export default class Slug extends Face {
  static properties = { ...Face.properties, prefix: {}, suffix: {} };

  get from() {
    let doc = get_document(this);
    let field = doc.title ? "title" : doc.name ? "name" : "";
    console.log("++ from field", field);
    if (field) return field;
    return false;
  }
  get from_text() {
    let doc = get_document(this);
    return doc[this.from];
  }

  async generate() {
    let doc = get_document(this);
    console.log("generate ", doc, this.from_text);
    let slug = slugify(this.from_text);
    let ok = await api.checkSlug(slug, doc._type, doc._id);
    if (!ok) slug += "-" + hashID(5);
    console.log("generate RESULT ", slug);
    this.value = { current: slug };
    // this.requestUpdate();
  }
  update_input(e) {
    console.log("+++ update", hashID(5), e, e.target.value);
    this.value.current = e.target.value;
  }
  render() {
    console.log("render slug");
    return html`<form-input
      @input=${this.update_input}
      .value=${this.value.current}
      .label=${this.label}
    >
      ${this.from
        ? html`<button slot="suffix-button" @click=${this.generate}>
            Generate
          </button>`
        : ""}
    </form-input> `;
  }
}

customElements.define("pi-slug", Slug);
