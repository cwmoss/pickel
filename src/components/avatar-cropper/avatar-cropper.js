import { LitElement, html, css } from "../../vendor/lit-core.min.js";
import avatarcss from "./cropper.css.js";

import Cropper from "./cropper.esm.js";

let cropper_options = {
  aspectRatio: 1,
  autoCropArea: 1,
  viewMode: 1,
  movable: false,
  zoomable: false,
};
/*
cropper
        .getCroppedCanvas({ width: 256, height: 256 })
        .toBlob(blob => this.send_blob(blob), "image/png", 1);
*/
export default class AvatarCropper extends LitElement {
  static styles = [
    avatarcss,
    css`
      :host {
        display: block;
      }
    `,
  ];

  create_cropper(e) {
    console.log("+++ e.target", e);
    this.cropper = new Cropper(e.target, cropper_options);
  }
  render() {
    return html`<p>cropper!</p>
      <div>
        <img
          @load=${(e) => this.create_cropper(e)}
          src="/example.jpg"
          width="300"
        />
      </div>`;
  }
}

customElements.define("avatar-cropper", AvatarCropper);
