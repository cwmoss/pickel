import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import { get_schema_type, is_object } from "./schema.js";
import Input from "./input.js";
import Switch from "./switch.js";
import Dialog from "./dialog.js";
import Sortable from "./../../vendor/sortable.complete.esm.js";
/*
https://github.com/SortableJS/Sortable?tab=readme-ov-file
*/
export default class BContainer extends LitElement {
  static properties = {
    schema: { attribute: false },
    type: { type: String },
    of: { type: Array },
    level: { type: Number, reflect: true },
    label: {},
    schemaid: {},
    dialog_button: {},
    dialog_title: {},
    prefix: { type: String },
    value: { type: Object, attribute: false },
  };

  _type = "";
  _value = {};

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
    if (t == "array") {
      console.log("c-array", this.schemaid, t, this.value);
      this.build_array();
    } else {
      this.schema = get_schema_type(t, this.schemaid);
      console.log("c-schema", this.schemaid, t, this.value);
      this.build();
    }
    // this.requestUpdate();
  }

  get value() {
    return this._value;
  }
  set value(v) {
    if (!v) {
      if (this.type == "array") v = [];
      else if (this.type == "object") v = {};
    }
    this._value = v;
  }
  new_input(field, name, value) {
    let f;
    let type = field.type;
    let subtype = "";
    if (is_object(type)) {
      type = "object";
      subtype = field.type;
    }
    switch (type) {
      case "switch":
        f = new Switch();
        break;
      case "object":
        f = new BContainer();
        f.schemaid = this.schemaid;
        f.prefix = name;
        f.value = value ?? {};
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.type = subtype;
        break;
      case "array":
        f = new BContainer();
        f.schemaid = this.schemaid;
        f.prefix = name;
        f.value = value ?? [];
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.of = field.of;
        f.type = field.type;
        break;
      default:
        f = new Input();
        f.value = value;
    }
    return f;
  }
  new_array_item(e) {
    console.log("new click", e);
    e.preventDefault();
    e.stopImmediatePropagation();
    this.value = (this.value || []).concat([{}]);
    console.log("+++ new array", this.value);
    this.build_array();
  }
  updated() {
    if (this.type == "array") {
      let sortable = Sortable.create(this.querySelector(".els"), {
        delay: 100,
      });
    }
  }
  build_array() {
    let type = this.of[0].type;
    console.log(
      "+++ array build value",
      this.label,
      this.prefix,
      type,
      this.value
    );

    this.els = (this.value || []).map((val, index) => {
      let f = this.new_input({ type: type }, `${this.prefix}[${index}]`, val);
      f.opts = {
        label: this.name,
        // id: field.name,
      };
      return f;
    });
  }
  build() {
    console.log("+++ build", this.value);
    this.els = this.schema.fields.map((field) => {
      let name = `${this.prefix}[${field.name}]`;
      let value = this.value[field.name] ?? "";
      let f = this.new_input(field, name, value);
      f.opts = {
        name: name,
        label: field.title,
        id: field.name,
      };
      // f.setAttribute("value", this.value[field.name] ?? "");
      console.log(
        "++ new field",
        f.name,
        field.type,
        this.value[field.name],
        f
      );
      // f.setAttribute("name", f.name);
      return f;
    });
  }
  render_actions() {
    if (this.type != "array") return "";
    return html`<div class="container--actions">
      <button @click=${(e) => this.new_array_item(e)} part="button">add</button>
    </div>`;
  }
  render_els() {
    return this.els;
  }
  render() {
    console.log("render container", this.els);
    return html`<h4>${this.label} ${this._type}</h4>
      ${this.dialog_button
        ? html`<b-dialog title="edit" trigger_title="Edit!">
            <div class="els">${this.render_els()}</div>
          </b-dialog> `
        : html`${this.render_actions()}
            <div class="els">${this.render_els()}</div>`} `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("b-container", BContainer);
