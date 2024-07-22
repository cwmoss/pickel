import { html } from "../../vendor/lit-core.min.js";
import { get_component, resolve_components } from "./component-loader.js";

import Container from "./container.js";
import ObjectPreview from "./object-preview.js";
import schema from "../lib/schema.js";
import api from "../lib/slow-hand.js";

export default class ObjectContainer extends Container {
  get_types() {
    let fields = this.schema.fields || [];
    fields = fields.map((f) => {
      if (f.component) {
        return f.component;
      }
      if (schema.is_reference(f.type)) {
        return "reference";
      }
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
  get value() {
    console.log("$$$ GETTER FOR VALUE");
    return this._value;
  }
  set value(v) {
    if (!v) {
      v = {};
    }
    this._value = v;
  }

  build() {
    //this.editmode = false;
    // console.log("+++ build", this.value);
    let fields = this.schema.fields;
    this.els = this.fields_to_els(fields);
    this.preview = this.get_preview("container");
  }

  get_preview(from) {
    // top level document
    console.log(
      "$object container get_preview RENDER",
      this.type,
      schema.is_document(this.type)
    );
    if (schema.is_document(this.type)) return "";
    console.log(
      "$object container get_preview RENDER 01",
      this.type,
      schema.is_document(this.type)
    );
    let data = {};
    Object.assign(data, this._value, this._preview_data);
    // console.log("++getpreview", from, this.refs?.person);
    // let title = this.schema?.preview?.title;
    let p = new ObjectPreview();

    p.set_data(data, this.schema, schema.get_preview(data));
    return p;
  }

  render_preview() {
    return this.preview;
  }
}

customElements.define("pi-objectcontainer", ObjectContainer);
