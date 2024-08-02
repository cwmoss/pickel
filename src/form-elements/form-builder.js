import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import { schema_build } from "../lib/schema.js";
import ObjectContainer from "../form-elements/object-container.js";
import Button from "./button.js";

export default class FormBuilder extends LitElement {
  static properties = {
    schema: { attribute: false },
    document_type: {},
    value: { type: Object },
    container: { type: Object, attribute: false },
  };

  _id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

  connectedCallback() {
    super.connectedCallback();
    //this.form = this.parentElement;
    //this.form.addEventListener("submit", (e) => this.submit(e));
    let text = this.innerText.trim();
    console.log("form-builder connected");
    if (text) {
      this.schema = schema_build(text);
      this.innerText = "";
      this.document_type = this.schema.get_schema_first_document();
    } else {
      console.warn("no schema for form-builder");
    }
    console.log(
      "+++ connected form-builder",
      this.schema,
      this._id,
      this.innerText,
      this.value
    );
    this.build();
  }

  build() {
    if (!this.document_type) return;
    console.log(
      "$$$ form-builder build container",
      this.document_type,
      this._id,
      this.value
    );

    this.document_schema = this.schema.get_type(this.document_type);

    this.container = new ObjectContainer();
    console.log("$$$ form-builder set_schema in objectc");
    this.container.set_schema(this.document_schema);
    this.container.editmode = true;

    this.container.value = this.value;

    this.container.prefix = "";
    this.container.schemaid = this._id;
    this.container.level = 0;
  }

  xxupdated(changedProperties) {
    if (changedProperties.has("document")) {
      this.load_schema();
    }
  }

  save(e) {
    // let data = new FormData(this.form);
    e.preventDefault();
    console.log("+++ save", this.container.get_updated_data(), this.form);
    const evt = new CustomEvent("pi-submit", {
      detail: this.container.get_updated_data(),
      bubbles: false,
      // composed: true,
    });
    this.dispatchEvent(evt);
    return false;
  }

  // ${this.container}
  render() {
    console.log("render form-builder", this.value, this.container);
    return html`<form id="editor" @submit=${this.save}>
      <div ?hidden=${this.fullscreen} class="actions"></div>
      <section
        style="padding:1rem;"
        @get-document=${this.send_document}
        @toggle-fullscreen="${this.go_fullscreen}"
      >
        ${this.container}
      </section>

      <pi-btn primary @click=${this.save}>Save</pi-btn>
    </form> `;
  }
}

customElements.define("form-builder", FormBuilder);
