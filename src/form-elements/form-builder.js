import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import { schema_build, schema_build_from_yaml } from "../lib/schema.js";
import ObjectContainer from "./object-container.js";
import Button from "./button.js";

let yamlparser = null;

export default class FormBuilder extends LitElement {
  static properties = {
    // property to change schema definition
    schema: { attribute: false },
    // property to change shortened yaml schema definition
    yaml_schema: { attribute: false },
    // the real schema
    _schema: { state: true, type: Object },
    document_type: {},
    value: { type: Object },
    container: { type: Object, attribute: false },
  };

  _id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

  connectedCallback() {
    super.connectedCallback();
    //this.form = this.parentElement;
    //this.form.addEventListener("submit", (e) => this.submit(e));
    this.load_schema();
    console.log(
      "+++ connected form-builder",
      this._schema,
      this._id,
      this.innerText,
      this.value
    );
  }

  async load_schema() {
    let text = this.innerText.trim();
    console.log(
      "$$$ form-builder try innerText, schema, yaml_schema",
      text,
      this.schema,
      this.yaml_schema
    );

    if (!this._schema) {
      console.log("$$$ form-builder connected schema-build YES", this._schema);
      if (text) {
        this._schema = schema_build(text);
        this.innerText = "";
      } else {
        if (this.schema) {
          this._schema = schema_build(this.schema);
        } else {
          if (this.yaml_schema) {
            console.log("build schema from yaml structure");
            if (
              typeof this.yaml_schema === "string" ||
              this.yaml_schema instanceof String
            ) {
              if (!yamlparser) {
                const { default: YAML } = await import(
                  "../../vendor/yamlparser.min.js"
                );
                console.log("yamlparser loaded", YAML);
                yamlparser = YAML;
              }
              console.log("yamlparser loaded2", yamlparser);
              this.yaml_schema = yamlparser.parse(this.yaml_schema);
            }
            this._schema = schema_build_from_yaml(this.yaml_schema);
          } else {
            console.warn("no schema for form-builder");
          }
        }
      }
    }
    if (!this.document_type)
      this.document_type = this._schema.get_schema_first_document();
    console.log("+schema", this._schema);
    this.build();
  }
  updated(changedProperties) {
    if (
      changedProperties.has("schema") ||
      changedProperties.has("yaml_schema")
    ) {
      console.log("prop update");
      this.load_schema();
      //schema_build(this.schema);
      //this.document_type = this.schema.get_schema_first_document();
      //this.build();
      //this.requestUpdate();
    }
  }

  build() {
    if (!this.document_type) return;
    if (!this._schema) return;
    this.document_schema = this._schema.get_type(this.document_type);

    console.log(
      "$$$ form-builder build container",
      this.document_type,
      this.document_schema,
      this._schema,
      this._id,
      this.value
    );

    this.container = new ObjectContainer();
    console.log("$$$ form-builder set_schema in objectc");
    this.container.set_schema(this.document_schema, this._schema);
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
    let ok = this.container.validate_sync();
    console.log("+++ save", ok, this.container.get_updated_data(), this.form);
    if (ok) {
      const evt = new CustomEvent("pi-submit", {
        detail: this.container.get_updated_data(),
        bubbles: false,
        // composed: true,
      });
      this.dispatchEvent(evt);
    }
    return false;
  }

  // ${this.container}
  render() {
    console.log("$$$ render form-builder", this.value, this.container);
    // if (!this.container) return "";
    return html`<form id="editor" @submit=${this.save}>
      <div ?hidden=${this.fullscreen} class="actions"></div>
      <section
        style="margin-bottom:1rem;"
        @get-document=${this.send_document}
        @toggle-fullscreen="${this.go_fullscreen}"
      >
        ${this.container}
      </section>

      <pi-btn primary @click=${this.save}>Save</pi-btn>
    </form> `;
  }
}

customElements.define("pi-form-builder", FormBuilder);
