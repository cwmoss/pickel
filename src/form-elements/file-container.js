import { html } from "../../vendor/lit-core.min.js";
import {
  get_component_element,
  resolve_components,
} from "./component-loader.js";
import ObjectContainer from "./object-container.js";
// import Container from "./container.js";
import ObjectPreview from "./object-preview.js";
import MediaWidget from "../slowhand/media-widget.js";
import api from "../lib/api.js";

export default class FileContainer extends ObjectContainer {
  static empty_value = {};

  static properties = {
    ...ObjectContainer.properties,
    uploader: { type: Object },
    asset: { type: Object },
    info: { type: Object },
  };
  constructor() {
    super();
    console.log("+++ build construct filecontainer", this.value, this.schema);
    // this.prefix = this.getAttribute("prefix");
    //this.schema = test;
  }

  update_value(val) {
    console.log("$FILE update value", val);
    this.init();
  }

  // TODO: warum wird das so früh aufgerufen?
  get_updated_data() {
    if (!this.asset) return this._value;
    let value = this._value || {};
    /*
      do some corrections
    */
    if (Array.isArray(value)) value = {};
    console.log(
      "$$$$ file updated data",
      JSON.stringify(this.value),
      this.schema
    );
    value._type = this.schema.name ?? "file";
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

  get download_url() {
    if (!this.value?.asset) return "";
    return api.download_file_url(this.value.asset._ref);
  }

  async init() {
    console.log("$FILE after init start0", JSON.stringify(this.value));
    if (this.value.asset?._ref) {
      console.log("$FILE after init start");
      this.asset = await api.document(this.value.asset._ref);
      console.log("$FILE after init end");
    }
  }

  build() {
    console.log(
      "$FILE +++ build file-build",
      this,
      this.supertype,
      this.schema
    );

    this.uploader = get_component_element("imageupload");
    this.uploader.image = api.imageurl_from_ref(this.value.asset); // this.value.asset;
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
    console.log("FileContainer preview", this.preview);
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
    return html` no-actions `;
  }
  render_info() {
    if (!this.asset) return "";
    return html`${this.asset._ref}`; // (${this.asset.size})
  }
  render_els() {
    console.log("$FILE +++ render FileContainer", this.value.asset);
    let title = this.value?.asset?._ref ?? "";
    return html`<a target="_blank" href="${this.download_url}">${title}</a>`;
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

customElements.define("pi-file-container", FileContainer);
