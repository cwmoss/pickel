import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import schema from "../lib/schema.js";
import { get_component, resolve_components } from "./component-loader.js";
import api from "../lib/slow-hand.js";

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
    options: { type: Object },
    edit_item: { type: Object },
    has_image: { type: Boolean },
  };

  _value = {};
  _type = "";
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
    console.log("$$$ GETTER FOR VALUE");
    return this._value;
  }
  set value(v) {
    this._value = v;
  }
  // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
  is_empty() {
    let value = this.value;

    //if (typeof value !== 'object') {
    // boolean, number, string, function, etc.
    //  return false;
    //}

    // console.error("empty array?", this._name, value);
    if (Array.isArray(value)) {
      return value.length == 0;
    }

    const proto = Object.getPrototypeOf(value);

    // consider `Object.create(null)`, commonly used as a safe map
    // before `Map` support, an empty object as well as `{}`
    if (proto !== null && proto !== Object.prototype) {
      return false;
    }

    for (const prop in value) {
      if (Object.hasOwn(value, prop)) {
        return false;
      }
    }
    return true;
  }
  get_updated_data() {
    let value = this._value || {};
    this.els.forEach((el) => {
      const val = el.get_updated_data();

      let name = el._name;
      if (el.is_empty()) {
        delete value[name];
      } else {
        value[name] = val;
      }
    });
    console.log("$container get updated data", this._name, value);
    return value;
  }

  async after_init() {}

  async init() {
    this.schema = schema.get_type(this.type);
    let types = this.get_types();

    console.log("$ resolve (C) for", this._name, this.type);
    await resolve_components([...new Set(types)]);

    this.build();
    this.requestUpdate();
    await this.after_init();
  }

  new_input(field, name, value) {
    let f;
    let type = field.type;
    let subtype = "";
    if (schema.is_reference(type)) {
      type = "reference";
      subtype = field.type;
    }
    if (schema.is_object(type)) {
      type = "object";
      subtype = field.type;
    }
    if (schema.is_image(type)) {
      type = "image";
      subtype = field.type;
    }
    let component = "";

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
        f = get_component("object");
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
        console.log("$container ++ array container // field", field);
        component = "array";
        if (field.component) {
          component = field.component;
        }
        f = get_component(component);
        f.schemaid = this.schemaid;
        f.prefix = name;
        f.value = value ?? [];
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.of = field.of;
        f.options = field.opts || {};
        f.type = field.type;
        console.log("$container ++ array container2 // container", f, f.opts);
        break;
      case "reference":
        f = get_component("reference");
        f.type = subtype;
        f.schemaid = this.schemaid;
        f.originalType = type;
        f.value = value ?? {};
        f.level = (this.level ?? 0) + 1;
        f.label = field.title;
        f.dialog_button = field.dialog_button;
        f.dialog_title = field.dialog_title;
        f.schema = field;
        this.refs[field.name] = f;
        break;
      default:
        f = get_component(type);
        f.originalType = type;
        f.value = value;
    }

    f._name = field.name;
    return f;
  }

  fields_to_els(fields) {
    let val = this.value;
    console.log("$ fields=>array", this._value);
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

  get_preview() {}

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
  }

  render_preview() {
    return this.get_preview();
  }

  render() {
    // ${this.render_preview()}
    // console.log("render container", this.els);
    let preview = true;

    if (this.editmode !== undefined) {
      preview = !this.editmode;
    } else {
      if (this.level > 3) preview = true;
      else preview = false;
    }

    // if (preview) return this.render_preview();
    return html`<div @preview-data=${this.new_previewdata}>
      ${this.noLabel ? "" : html`<h4 title=${this.type}>${this.label}</h4>`}
      <div ?hidden=${!preview} class="preview">${this.render_preview()}</div>
      <div ?hidden=${preview} class="edit">
        ${this.dialog_button
          ? html`<pi-dialog
              title=${this.dialog_title ?? "edit"}
              trigger_title=${this.dialog_button}
            >
              <div class="els">${this.render_els()}</div>
            </pi-dialog>`
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
