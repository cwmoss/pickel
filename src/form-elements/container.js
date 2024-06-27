import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import schema from "../lib/schema.js";
import { get_component, resolve_components } from "./component-loader.js";
import api from "../lib/slow-hand.js";

import Dialog from "./dialog.js";
import ObjectPreview from "./object-preview.js";

export default class Container extends LitElement {
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
    editmode: { type: Boolean, reflect: true },
    noLabel: { type: Boolean },
    preview: { type: Object },
  };

  _type = "";
  _value = {};
  _preview_data = {};
  els = [];
  refs = {};

  // TODO: better way to deal with circular dependency?
  //load_container($name){
  //  const { default: PageClass } = await import(path);
  //}
  constructor() {
    super();
    //console.log("construct container");
    // this.prefix = this.getAttribute("prefix");
    //this.schema = test;
  }

  async connectedCallback() {
    super.connectedCallback();
    // console.log("++ connected");
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

  get_types() {
    let fields = this.schema.fields || [];
    fields = fields.map((f) => {
      if (schema.is_object(f.type)) {
        return "object";
      }
      if (schema.is_image(f.type)) {
        return "imageobject";
      }
      return f.type;
    });
    return fields;
  }

  after_init() {}

  async init() {
    this.schema = schema.get_type(this.type);
    let types = this.get_types();

    await resolve_components([...new Set(types)]);

    this.build();
    this.requestUpdate();
    this.after_init();
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
        f = get_component("imageobject");
        f.schemaid = this.schemaid;
        f.prefix = name;
        f.value = value ?? { asset: null };
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.dialog_button = field.dialog_button;
        f.dialog_title = field.dialog_title;
        f.type = subtype;
        break;
      case "object":
        f = new Container();
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
        f = get_component("array");
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
    if (type == "reference") {
      this.refs[field.name] = f;
    }
    f._name = field.name;
    return f;
  }

  fields_to_els(fields) {
    return fields.map((field) => {
      let name = `${this.prefix}[${field.name}]`;
      let value = this.value[field.name] ?? "";
      let f = this.new_input(field, name, value);
      f.opts = {
        name: name,
        label: field.title,
        id: field.name,
      };
      // f.setAttribute("value", this.value[field.name] ?? "");

      // f.setAttribute("name", f.name);
      return f;
    });
  }

  build() {
    //this.editmode = false;
    // console.log("+++ build", this.value);
    let fields = this.schema.fields;
    this.els = this.fields_to_els(fields);
    this.preview = this.get_preview("container");
  }

  new_previewdata(e) {
    e.stopPropagation();
    console.log("++preview DATA", this.type, this.prefix, e.detail);
    this._preview_data[e.detail.name] = e.detail;
    this.preview = this.get_preview("containerUPDATE");
    this.requestUpdate();
  }
  render_actions() {
    return "";
  }

  render_els() {
    return this.els;
    let preview = this.level > 0 && !this.editmode;
    if (preview) return this.preview;
  }

  get_preview(from) {
    let data = {};
    Object.assign(data, this._value, this._preview_data);
    console.log("++getpreview", from, this.refs?.person);
    // let title = this.schema?.preview?.title;
    let p = new ObjectPreview();

    p.set_data(data, this.schema);
    return p;
  }
  render_preview() {
    if (this.level == 0) return "";
    return this.get_preview();
    return html`${title}`;
  }
  render() {
    // ${this.render_preview()}
    // console.log("render container", this.els);
    let preview = this.level > 0 && !this.editmode;
    preview = false;
    // if (preview) return this.render_preview();
    return html`<div @preview-data=${this.new_previewdata}>
      ${this.noLabel ? "" : html`<h4 title=${this.type}>${this.label}</h4>`}
      <div ?hidden=${this.editmode} class="preview">
        ${this.render_preview()}
      </div>
      <div ?hidden=${!this.editmode} class="edit">
        ${this.dialog_button
          ? html`<b-dialog
              title=${this.dialog_title ?? "edit"}
              trigger_title=${this.dialog_button}
            >
              <div class="els">${this.render_els()}</div>
            </b-dialog>`
          : html`
              <div
                @toggle-fullscreen=${(e) => {
                  console.log("$$ fullscreen", e);
                }}
                class="els"
              >
                ${this.render_els()}
              </div>
              ${this.render_actions()}
            `}
      </div>
    </div>`;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define("pi-container", Container);
