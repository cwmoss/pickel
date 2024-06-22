import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
// import { get_schema_type, is_object } from "./schema.js";
import schema from "../../lib/schema.js";
import { get_component, resolve_components } from "./component-loader.js";

//import Input from "./input.js";
//import Switch from "./switch.js";
import Dialog from "./dialog.js";
import Sortable from "./../../vendor/sortable.complete.esm.js";
let handle_img = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  height="24"
  viewBox="0 0 24 24"
  width="16"
>
  <path d="M0 0h24v24H0z" fill="none" />
  <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
</svg>`;
/*
https://github.com/SortableJS/Sortable?tab=readme-ov-file
*/
export default class BContainer extends LitElement {
  static properties = {
    schema: { attribute: false },
    type: { type: String },
    of: { type: Array },
    level: { type: Number, reflect: true },
    array: { type: Boolean, reflect: true },
    label: {},
    schemaid: {},
    dialog_button: {},
    dialog_title: {},
    is_image: { type: Boolean },
    prefix: { type: String },
    value: { type: Object, attribute: false },
  };

  _type = "";
  _value = {};
  els = [];

  constructor() {
    super();
    console.log("construct container");
    // this.prefix = this.getAttribute("prefix");
    //this.schema = test;
  }

  async connectedCallback() {
    super.connectedCallback();
    console.log("++ connected");
    await this.init();
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
  get_updated_data() {
    let value = this._value || {};
    this.els.forEach((el) => {
      const val = el.get_updated_data();
      let name = el._name;
      value[name] = val;
    });
    return value;
  }

  async init() {
    if (this.type != "array") this.schema = schema.get_type(this.type);
    let types =
      this.type == "array" ? [{ type: this.of[0].type }] : this.schema.fields;
    types = types.map((f) => {
      if (schema.is_object(f.type)) {
        return "object";
      }
      return f.type;
    });
    if (this.is_image) {
      types.push("image");
    }
    await resolve_components([...new Set(types)]);

    if (this.type == "array") {
      this.array = true;
      console.log("c-array", this.schemaid, this.value);
      this.build_array();
    } else {
      console.log(
        "c-schema",
        this.schemaid,
        this.schema,
        this.type,
        this.value
      );
      this.build();
    }
    this.requestUpdate();

    if (this.type == "array") {
      setTimeout(() => {
        let sortable = Sortable.create(this.querySelector(".els"), {
          delay: 100,
          handle: ".handle",
          onEnd: (e) => this.dropped(e),
        });
      });
    }
  }

  new_input(field, name, value) {
    let f;
    let type = field.type;
    let subtype = "";
    if (schema.is_object(type)) {
      type = "object";
      subtype = field.type;
    }
    if (schema.is_image(type)) {
      type = "image";
      subtype = field.type;
    }
    switch (type) {
      case "image":
        f = new BContainer();
        f.schemaid = this.schemaid;
        f.prefix = name;
        f.value = value ?? { asset: null };
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.dialog_button = field.dialog_button;
        f.dialog_title = field.dialog_title;
        f.type = subtype;
        f.is_image = true;
        break;
      case "object":
        f = new BContainer();
        f.schemaid = this.schemaid;
        f.prefix = name;
        f.value = value ?? {};
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.dialog_button = field.dialog_button;
        f.dialog_title = field.dialog_title;
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
        f = get_component(type);
        f.originalType = type;
        f.value = value;
    }
    f._name = field.name;
    return f;
  }
  new_array_item_value(type) {
    switch (type) {
      case "reference":
        return "";
      case "string":
        return "";
      default:
        return {};
    }
  }
  new_array_item(e) {
    console.log("new click", e);
    e.preventDefault();
    e.stopImmediatePropagation();
    // this.value.push({}); //(this.value || []).concat([{}]);
    console.log("+++ new array", this.value);
    // this.build_array();
    let type = this.of[0].type;
    let index = this.els.length;
    let val = this.new_array_item_value(type);
    if (!this.value) {
      this.value = [val];
    } else {
      this.value.push(val);
    }

    let f = this.new_input({ type: type }, `${this.prefix}[${index}]`, val);
    f.opts = {
      label: this.name,
      // id: field.name,
    };
    //this
    this.els.push(f);
    this.requestUpdate();
  }
  dropped(e) {
    console.log(
      "+++ dropped old=>new",
      e.oldIndex,
      e.newIndex,
      this.querySelectorAll(".els > *")
    );
  }
  rearrange(from, to) {}

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
    let fields = this.schema.fields;
    let img;
    if (this.is_image) {
      img = get_component("image");
      img.value = this.value.asset;
      // this.els.unshift(img);
      fields = fields.filter((f) => f.name != "asset");
    }
    this.els = fields.map((field) => {
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
    if (img) this.els.unshift(img);
  }
  render_actions() {
    if (this.type != "array") return "";
    return html`<div class="container--actions">
      <button
        type="button"
        @click=${(e) => this.new_array_item(e)}
        part="button"
      >
        add
      </button>
    </div>`;
  }
  render_els() {
    if (this.type == "array") {
      return html`${this.els.map((el) => {
        return html`<div class="el">
          <div class="handle">${handle_img}</div>
          ${el}
        </div> `;
      })}
      ${this.els.length == 0
        ? html`<div class="container--empty-array">no entries</div>`
        : ""} `;
    } else {
      return this.els;
    }
  }
  render() {
    console.log("render container", this.els);
    return html`<h4 title=${this.type}>${this.label}</h4>
      ${this.dialog_button
        ? html`<b-dialog
            title=${this.dialog_title ?? "edit"}
            trigger_title=${this.dialog_button}
          >
            <div class="els">${this.render_els()}</div>
          </b-dialog> `
        : html`
            <div class="els">${this.render_els()}</div>
            ${this.render_actions()}
          `} `;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("b-container", BContainer);
