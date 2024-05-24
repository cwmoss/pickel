import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import { get_schema_type } from "./schema.js";
import Input from "./input.js";
import Switch from "./switch.js";
import Dialog from "./dialog.js";

export default class BContainer extends LitElement {
  static properties = {
    schema: { attribute: false },
    type: { type: String },
    schemaid: {},
    prefix: { type: String },
    value: { type: Object, attribute: false },
  };

  _type = "";

  constructor() {
    super();
    console.log("construct container");
    // this.prefix = this.getAttribute("prefix");
    //this.schema = test;
  }

  get type() {
    return this._type;
  }

  set type(t) {
    this._type = t;
    this.schema = get_schema_type(t, this.schemaid);
    console.log("c-schema", this.schemaid, t, this.value);
    this.build();
    // this.requestUpdate();
  }

  build() {
    console.log("+++ build", this.value);
    this.els = this.schema.fields.map((field) => {
      let f;
      if (field.type == "switch") {
        f = new Switch();
        f.name = `${this.prefix}[${field.name}]`;
        f.label = field.title;
        f.id = field.id;
        f.appendChild(new Image());
      } else {
        f = new Input();
        f.opts = {
          name: `${this.prefix}[${field.name}]`,
          label: field.title,
          id: field.name,
        };
      }
      f.setAttribute("value", this.value[field.name] ?? "");
      // f.setAttribute("name", f.name);
      return f;
    });
  }
  render_els() {
    return this.els;
  }
  render() {
    console.log("render container", this.els);
    return html`container for: ${this._type}<br /><br />
      <template> ${this.render_els()} </template> `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("b-container", BContainer);
