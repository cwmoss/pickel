import { html } from "../../vendor/lit-core.min.js";
import { get_component, resolve_components } from "./component-loader.js";
import ObjectContainer from "./objectcontainer.js";
import schema from "../lib/schema.js";
import api from "../lib/slow-hand.js";

export default class ImageContainer extends ObjectContainer {
  static properties = {
    ...ObjectContainer.properties,
    uploader: { type: Object },
    asset: { type: Object },
    info: { type: Object },
  };
  get value() {
    return this._value || {};
  }
  set value(v) {
    if (!v) {
      v = {};
    }
    this._value = v;
  }
  get_types() {
    let types = super.get_types();
    types.push("image");
    return types;
  }

  async after_init() {
    if (this.value.asset?._ref) {
      this.asset = await api.document(this.value.asset._ref);
    }
  }

  build() {
    this.uploader = get_component("image");
    this.uploader.value = api.imageurl_from_ref(this.value.asset); // this.value.asset;
    this.uploader.upload_url = api.upload_image_url();
    // console.log("+++ build", this.value);
    let fields = this.schema.fields;
    //img.existing = img.value ? true : false;
    // img.existing = api.imageurl_from_ref(this.value.asset);
    // this.els.unshift(img);
    fields = fields.filter((f) => f.name != "asset");

    this.els = this.fields_to_els(fields);
  }

  image_removed() {
    console.log("$ remove image");
    this.value = null;
    this.uploader.remove();
    this.asset = null;
    this.requestUpdate();
  }
  image_uploaded(e) {
    console.log("$ uploaded image", e.detail);
  }
  render_imageactions() {
    return html`<pi-btn>pick image</pi-btn>`;
  }
  render_info() {
    if (!this.asset) return "";
    return html`${this.asset.width} x ${this.asset.height} (${this.asset.size})`;
  }
  render_els() {
    return html`<div
        class="image-container"
        @image-removed=${this.image_removed}
        @image-uploaded=${this.image_uploaded}
      >
        ${this.uploader}
        <div class="image-container--details">
          <div class="image-container--actions">
            ${this.render_imageactions()}
          </div>
          <div class="image-container--info">${this.render_info()}</div>
        </div>
      </div>
      <div class="image-container--fields">${this.els}</div> `;
  }
  render_preview() {
    return "";
  }
}

customElements.define("pi-imagecontainer", ImageContainer);
