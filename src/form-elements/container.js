import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import {
  get_component,
  get_component_tag,
  resolve_components,
} from "./component-loader.js";
import { is_empty } from "../lib/util.js";

export default class Container extends LitElement {
  static properties = {
    // schema of this field
    schema: { attribute: false, type: Object, noAccessor: true },
    value: { attribute: false, type: Object, noAccessor: true },
    /*
      manager contains the schema object
      schema contains the fieldschema object
    */
    manager: { attribute: false, type: Object, noAccessor: true },
    type: { type: String },
    supertype: { type: String },
    of: { type: Array, noAccessor: true },
    level: { type: Number, reflect: true },
    array: { type: Boolean, reflect: true },
    label: {},
    schemaid: {},
    dialog_button: {},
    dialog_title: {},
    is_image: { type: Boolean },
    prefix: { type: String },

    editmode: { type: Boolean, reflect: true },
    noLabel: { type: Boolean },
    preview: { type: Object },
    options: { type: Object, noAccessor: true },
    edit_item: { type: Object },
    has_image: { type: Boolean },
    defined_state: {
      state: true,
      hasChanged: (oldval, newval) => {
        console.log("$ARR $OBJ defined state", oldval, newval);
        return false;
      },
    },
    /*  uploader: { type: Object },
    asset: { type: Object },
    info: { type: Object },
    */
  };

  _was_build = false;
  _schema;
  _manager;
  _value;
  _of = [];
  _type = "";
  _preview_data = {};
  els = [];
  refs = {};

  static empty_value = {};

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

  connectedCallback() {
    super.connectedCallback();
    // console.log("++ connected");
    // his.init();
  }

  init_schema_value() {
    console.log(
      "$$$ $IMG init 0 container schema/value",
      this.constructor,
      this.manager,
      this._schema,
      this._value
    );
    if (!this.manager || !this._schema || !this._value) return;
    console.log(
      "$$$ $IMG init 1 container schema/value",
      this._schema,
      this._value
    );
    this.init();
    this.build();
    // this.update_value(this._value);
  }

  set manager(man) {
    this._manager = man;
    this.init_schema_value();
  }
  get manager() {
    return this._manager;
  }
  // sets the fieldschema
  set schema(fieldschema) {
    console.log("$ARR $OBJ $CONT +++ build (set schema)", this);
    this._schema = fieldschema;
    this.type = fieldschema.type;
    this.supertype = fieldschema.supertype;
    if (fieldschema.of) this.of = fieldschema.of;
    // if (gschema) schema = gschema;
    this.defined_state = "schema";
    this.init_schema_value();
  }
  get schema() {
    return this._schema;
  }

  get value() {
    return this._value || this.constructor.empty_value;
  }
  set value(v) {
    console.log("$CONTAINER set value", v);
    this._value = v;
    this.init_schema_value();
  }

  get of() {
    return this._of;
  }
  set of(v) {
    this._of = v;
  }

  _opts = {};
  set options(opts) {
    if (opts) this._opts = opts;
  }
  get options() {
    return this._opts;
  }
  // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object

  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  async validate() {
    let all_true = true;
    for (const el of this.els) {
      console.log("validate-element", el);
      // this.els.forEach(async (el) => {
      if (typeof el["validate"] === "function") {
        console.log("validate-element");
        let ok = await el.validate();
        if (ok !== true) all_true = false;
      }
    }
    return all_true;
  }

  validate_sync() {
    let all_true = true;
    for (const el of this.els) {
      console.log("validate-element", el);
      // this.els.forEach(async (el) => {
      if (typeof el["validate_sync"] === "function") {
        console.log("validate-element");
        let ok = el.validate_sync();
        if (ok !== true) all_true = false;
      }
    }
    return all_true;
  }
  update_value(val) {
    this._value = val;
    this.els.forEach((el) => {
      let name = el._name;
      el.value = val[name];
    });
  }

  get_updated_data() {
    let value = this._value || {};
    this.els.forEach((el) => {
      const val = el.value; // el.get_updated_data();
      console.log(
        "$container-element get updated data",
        el._name,
        el.constructor.name,
        val
      );

      let name = el._name;
      if (is_empty(el.value)) {
        delete value[name];
      } else {
        value[name] = val;
      }
    });
    console.log("$container get updated data", this._name, value);
    return value;
  }

  init() {}

  new_input(field, name, value) {
    // console.log("$ARR $OBJ new input", field);
    let fieldschema = this.manager.get_field_schema(field);
    let comp = this.manager.get_component_for_field(fieldschema);
    let tag = get_component_tag(comp);
    console.log(
      "$ARR $OBJ +++ build (new_input)",
      fieldschema.supertype,
      tag,
      field,
      fieldschema,
      value
    );
    // let is_container = schema.is_container(field);
    let f = document.createElement(tag);

    f.label = field.title;
    f._name = field.name;

    switch (fieldschema.supertype) {
      case "file":
      case "image":
        console.log(
          "+++ build $IMG (image/file)",
          f,
          field,
          fieldschema,
          this.manager
        );
        f.manager = this.manager;
        f.schema = fieldschema;
        f.value = value ?? { asset: null };
        break;
      case "array":
        f.manager = this.manager;
        f.options = fieldschema.options;
        f.schema = fieldschema;
        f.value = value ?? [];
        f.level = (this.level ?? 0) + 1;
        break;
      case "object":
        f.manager = this.manager;
        console.log("$OBJ set schema");
        f.schema = fieldschema;
        f.level = (this.level ?? 0) + 1;
        f.value = value ?? {};
        break;
      case "reference":
        // f.manager = this.manager;
        f.schema = fieldschema;
        f.value = value ?? {};
        break;
      default:
        f.originalType = field.type;
        f.options = field.options;
        f.initialValue = field.initialValue;
        f.value = value;
    }

    if (field.validation && typeof f["set_validation"] === "function") {
      f.set_validation(field.validation);
      console.warn("setting validations", field.validation, f);
    }

    return f;
  }

  fields_to_els(fields) {
    let val = this.value;
    console.log("$ fields=>array", this._value);
    return fields.map((field) => {
      let name = `${this.prefix}[${field.name}]`;
      let value = this.value[field.name] ?? undefined;
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
    if (!this.schema) return;
    let preview = true;

    if (this.editmode !== undefined) {
      preview = !this.editmode;
    } else {
      if (this.level > 3) preview = true;
      else preview = false;
    }

    // if (preview) return this.render_preview();
    return html`<div @preview-data=${this.new_previewdata}>
      ${this.noLabel
        ? ""
        : html`<label title=${this.type}>${this.label}</label>`}
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
