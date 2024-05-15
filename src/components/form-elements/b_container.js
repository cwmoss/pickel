import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import { get_schema_type } from "./schema.js";
import Input from "./input.js";

export default class BContainer extends LitElement {
  static properties = {
    schema: { attribute: false },
    _type: { type: String },
    prefix: { type: String },
    value: { type: Object, attribute: false },
  };

  constructor() {
    super();
    console.log("construct container");
    // this.prefix = this.getAttribute("prefix");
    //this.schema = test;
  }

  set type(t) {
    this._type = t;
    this.schema = get_schema_type(t);
    console.log("c-schema", this.schema, this.value);
    this.build();
    // this.requestUpdate();
  }

  build() {
    console.log("+++ build", this.value);
    this.els = this.schema.fields.map((field) => {
      let f = new Input();
      f.props = {
        name: `${this.prefix}[${field.name}]`,
        label: field.title,
        id: field.name,
      };
      f.setAttribute("value", this.value[field.name] ?? "");
      return f;
    });
  }
  render() {
    console.log("render container", this.els);
    return html`container for: ${this._type}<br /><br />

      ${this.els} `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("b-container", BContainer);
