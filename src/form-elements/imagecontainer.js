import { html } from "../../vendor/lit-core.min.js";
import { get_component, resolve_components } from "./component-loader.js";
import ObjectContainer from "./objectcontainer.js";
import ObjectPreview from "./object-preview.js";
import MediaWidget from "../slowhand/media-widget.js";
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
    console.log("$$$$ imagecontainer SET", JSON.stringify(v));
    if (!v) {
      v = {};
    }
    this._value = v;
  }

  // TODO: warum wird das so früh aufgerufen?
  get_updated_data() {
    if (!this.asset) return this._value;
    let value = this._value || {};
    console.log(
      "$$$$ image updated data",
      JSON.stringify(this.value),
      this.schema
    );
    value._type = this.schema.name ?? "image";
    value.asset = {
      type: "reference",
      _ref: this.asset?._id,
    };
    this.els.forEach((el) => {
      const val = el.get_updated_data();
      let name = el._name;
      value[name] = val;
    });
    return value;
  }

  get_types() {
    let types = super.get_types();
    types.push("imageupload");
    return types;
  }

  async after_init() {
    console.log("$$$$ after init start0", JSON.stringify(this.value));
    if (this.value.asset?._ref) {
      console.log("$$$$ after init start");
      this.asset = await api.document(this.value.asset._ref);
      console.log("$$$$ after init end");
    }
  }

  build() {
    this.uploader = get_component("imageupload");
    this.uploader.value = api.imageurl_from_ref(this.value.asset); // this.value.asset;
    this.uploader.upload_url = api.upload_image_url();
    // console.log("+++ build", this.value);
    let fields = this.schema.fields || [];
    //img.existing = img.value ? true : false;
    // img.existing = api.imageurl_from_ref(this.value.asset);
    // this.els.unshift(img);
    fields = fields.filter((f) => f.name != "asset");

    this.els = this.fields_to_els(fields);
    this.preview = new ObjectPreview();

    this.preview.set_data({
      id: this.value?.asset?._ref,
      title: this.value?.asset?._ref,
      media: this.value?.asset ?? "",
    });
  }
  get image_url_from_value() {
    if (!this.value.asset) return "";
    return api.imageurl_from_ref(this.value.asset);
  }
  get image_url() {
    // ${api.images()}/${this.item.path}
    if (!this.asset) return "";
    return api.imageurl_from_ref(this.asset._id);
  }
  image_removed() {
    console.log("$ remove image");
    this.value = null;
    this.uploader.remove();
    this.asset = null;
    this.requestUpdate();
  }
  image_picked(e) {
    console.log("$ picked image", e.detail);
    this.asset = e.detail;
    this.uploader.set_image(this.image_url);
    // this.requestUpdate();
  }
  image_uploaded(e) {
    console.log("$ uploaded image", e.detail);
    this.asset = e.detail;
    this.uploader.set_image(this.image_url);
  }
  render_imageactions() {
    return html`
      <pi-dialog
        ><pi-btn slot="button">pick image</pi-btn
        ><media-widget picker @pick-image=${this.image_picked}></media-widget
      ></pi-dialog>
      <focus-picker img="${this.image_url}"
        ><pi-btn slot="open">set hotspot</pi-btn></focus-picker
      >
    `;
  }
  render_info() {
    if (!this.asset) return "";
    return html`${this.asset.width} x ${this.asset.height} (${this.asset.size})`;
  }
  render_els() {
    console.log("+++ render ImageContainer", this.value.asset);
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
    return this.preview;
  }
}

customElements.define("pi-imagecontainer", ImageContainer);
