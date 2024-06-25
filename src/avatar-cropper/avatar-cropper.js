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
  static properties = {
    accept: { reflect: true },
    name: { reflect: true },
    dragging: { type: Boolean, reflect: true },
    dropped: { type: Boolean, reflect: true },
    image: {},
    label: {},
    id: {},
    placeholder: {},
    // opts: { attribute: false },
  };
  static styles = [
    avatarcss,
    css`
      :host {
        display: block;
      }

      #dropzone {
        position: relative;
        border: 2px dashed #000;
        border-radius: 0;
        color: #000;
        font: bold 24px/200px arial;
        height: 200px;
        margin: 30px auto;
        text-align: center;
        width: 200px;
      }

      :host([dragging]) #dropzone {
        border: 10px solid #fe5;
        color: #fe5;
      }

      :host([dropped]) #dropzone {
        background: #222;
        border: 10px solid silver;
      }

      #dropzone div {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      #dropzone img {
        border-radius: 0;
        vertical-align: middle;
        /* max-width: 95%;
        max-height: 95%;*/
      }

      #dropzone [type="file"] {
        cursor: pointer;
        position: absolute;
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
      :host([dropped]) [type="file"] {
        display: none;
      }
      .actions {
        display: flex;
        justify-content: space-between;
      }

      button {
        outline: 0;
        grid-gap: 8px;
        align-items: center;
        background: 0 0;
        border: 1px solid #000;
        border-radius: 4px;
        cursor: pointer;
        display: inline-flex;
        flex-shrink: 0;
        font-size: 16px;
        gap: 8px;
        justify-content: center;
        line-height: 1.5;
        overflow: hidden;
        padding: 12px 16px;
        text-decoration: none;
        text-overflow: ellipsis;
        transition: all 0.14s ease-out;
        white-space: nowrap;
      }
      button:hover:enabled {
        box-shadow: 4px 4px 0 #000;
        transform: translate(-4px, -4px);
      }
      button:focus-visible {
        outline-offset: 1px;
      }
      button.primary {
        background-color: #ff90e8;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    if (!this.accept) this.accept = "image/png, image/jpg, image/jpeg";
  }
  create_cropper(e) {
    console.log("+++ e.target", e);
    this.cropper = new Cropper(e.target, cropper_options);
  }
  drag(dragging) {
    if (dragging) {
      this.dragging = true;
    } else {
      this.dragging = false;
    }
  }

  do_crop() {
    let blob = this.cropper
      .getCroppedCanvas({ width: 256, height: 256 })
      .toBlob(
        (blob) => {
          this.dispatchEvent(
            new CustomEvent("finished-crop", {
              detail: { blob: blob },
              bubbles: 1,
              composed: 1,
            })
          );
        },
        "image/png",
        1
      );
  }

  cancel() {
    this.image = "";
    this.dropped = false;
    this.dispatchEvent(
      new CustomEvent("cancel-crop", {
        detail: {},
        bubbles: 1,
        composed: 1,
      })
    );
  }
  new_file() {
    this.dragging = false;
    this.dropped = true;
    let files = this.shadowRoot.querySelector("input").files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      //creating a thumbnail
      this.image = event.target.result;
    };
  }

  render_image() {
    return html`<img
      @load=${(e) => this.create_cropper(e)}
      src="${this.image}"
      width="300"
    />`;
  }
  render_content() {
    return `dropzone`;
  }
  render() {
    return html` <div>
      <div
        id="dropzone"
        @dragover=${() => this.drag(true)}
        @dragleave=${() => this.drag(false)}
      >
        <div id="content">
          ${this.image ? this.render_image() : this.render_content()}
        </div>
        <input
          @change=${() => this.new_file()}
          type="file"
          accept="${this.accept}"
        />
      </div>
      <div class="actions">
        <button
          class="primary"
          @click=${() => this.do_crop()}
          ?disabled=${!this.image}
        >
          Fertig
        </button>
        <button @click=${() => this.cancel()} ?disabled=${!this.image}>
          Abbrechen
        </button>
      </div>
    </div>`;
  }
}

customElements.define("avatar-cropper", AvatarCropper);
