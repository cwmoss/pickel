import { LitElement, html, css } from "../../vendor/lit-core.min.js";
import AvatarCropper from "./avatar-cropper.js";

function blobToDataURL(blob, callback) {
  let a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
}

export default class AvatarControl extends LitElement {
  static styles = css``;
  static properties = {
    image: {},
  };
  on_crop(detail) {
    console.log("cropped", detail);
    blobToDataURL(detail.blob, (url) => {
      this.image = url;
    });
  }
  render() {
    return html`<div>
      <avatar-cropper
        @finished-crop=${(e) => this.on_crop(e.detail)}
        @cancel-crop=${(e) => (this.image = null)}
      ></avatar-cropper>
      <div class="preview">
        ${this.image ? html`<img src="${this.image}" />` : ""}
      </div>
    </div> `;
  }
}

customElements.define("avatar-control", AvatarControl);
