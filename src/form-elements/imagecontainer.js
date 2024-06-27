import { html } from "../../vendor/lit-core.min.js";
import { get_component, resolve_components } from "./component-loader.js";
import Container from "./container.js";
import schema from "../lib/schema.js";
import api from "../lib/slow-hand.js";

export default class ImageContainer extends Container {
  get_types() {
    let types = super.get_types();
    types.push("image");
    return types;
  }

  build() {
    // console.log("+++ build", this.value);
    let fields = this.schema.fields;
    let img;
    // console.log("$ image", this.value);
    img = get_component("image");
    img.value = api.imageurl_from_ref(this.value.asset); // this.value.asset;
    //img.existing = img.value ? true : false;
    // img.existing = api.imageurl_from_ref(this.value.asset);
    // this.els.unshift(img);
    fields = fields.filter((f) => f.name != "asset");

    this.els = this.fields_to_els(fields);
    this.els.unshift(img);
  }

  render_preview() {
    return "";
  }
}

customElements.define("pi-imagecontainer", ImageContainer);
