import { LitElement, css, html, svg } from "./../vendor/lit-all.min.js";

const icon = svg`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<path
    class="path1"
    d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
></path>
</svg>
`;
const style = css`
  :host {
    display: block;
    width: 250px;
    height: 250px;
  }
  :host * {
    box-sizing: border-box;
  }
  :host([existing]) .drop,
  :host([uploading]) .drop {
    display: none;
  }
  :host(:not([existing])) {
    font-size: 20px;
  }
  :host(:not([existing])) .details,
  :host(:not([existing])) .remove {
    display: none !important;
  }
  :host([uploading]) .preview {
    opacity: 50%;
  }
  :host(:not([uploading])) progress {
    display: none;
  }

  button {
    border: 0;
    /* background: transparent; */
    color: black;
    cursor: pointer;
  }
  button.remove {
    padding: 0.5rem;
    place-self: start end;
  }
  button.remove::after {
    content: "\\2716";
  }
  .stack {
    display: grid;
    // place-items: center;
  }
  .stack > * {
    grid-area: 1 / 1;
  }
  section {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .drop {
    place-self: center;
    /* pointer-events: none; */
    box-sizing: border-box;
    margin: 1em auto;
    margin-bottom: 1em;
    padding: 0.5em;
    border: 0.3em dashed rgba(66, 66, 66, 0.15);
    border-radius: 0;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    cursor: pointer;
    display: grid;
    place-content: center;
  }

  .preview {
    background-color: rgba(199, 199, 199, 0.25);
    width: 250px;
    height: 250px;
  }
  .details {
    place-self: end start;
    display: flex;
    bottom: 0;
    width: 80%;
    padding: 1rem;
    background-color: #ffffffde;
    color: black;
    border-radius: 3px;
  }
  .descr {
    overflow: hidden;
  }
  .preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  label svg {
    cursor: pointer;
  }
  .message {
    place-self: end start;
    width: 100%;
    padding: 1rem;
    background-color: #ef8f8f;
    color: white;
    border-radius: 3px;
  }
  progress {
    border: none;
    height: 3px;
    width: 100%;
  }
  .message:empty {
    display: none;
  }

  [hidden] {
    display: none;
  }
`;

export default class ImageUpload extends LitElement {
  static properties = {
    thumb: {},
    fname: {},
    upload_label: { attribute: "upload-label" },
    upload_url: { attribute: "upload-url" },
    remove_url: { attribute: "remove-url" },
    existing: { reflect: true },
    uploading: { type: Boolean, reflect: true },
    error: {},
  };

  static styles = style;

  render_descr() {
    if (!this.thumb) return "";
    return html`${this.fname}<br />${this.thumb?.naturalWidth} x
      ${this.thumb?.naturalHeight} px`;
  }

  render_preview() {
    if (!this.thumb) return "";
    return this.thumb;
  }

  render() {
    return html`<section class="stack">
      <input @change=${this.handleChange} hidden id="fileUpload" type="file" />
      <progress max="100" value="0"></progress>
      <div class="preview">${this.render_preview()}</div>
      <div class="details">
        <div class="descr">${this.render_descr()}</div>
      </div>
      <button @click=${this.handleRemove} type="button" class="remove"></button>
      <label for="fileUpload" class="drop">${icon}</label>
      <div class="message">${this.error}</div>
    </section>`;
  }

  process(file) {
    this.uploading = true;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      //creating a thumbnail
      this.set_preview(null, event.target.result, file.name);
      // this.upload(file);
    };
  }

  set_preview(existing, upload, upload_name) {
    let thumb = null,
      name = null;

    if (upload) {
      thumb = document.createElement("img");
      console.log("++ upload");
      name = upload_name;
      thumb.src = upload;
    } else {
      if (existing) {
        thumb = document.createElement("img");
        thumb.src = existing;
        name = thumb.src.split("/").pop();
      }
    }
    this.thumb = thumb;
    this.fname = name;
    if (thumb) {
      // this.select(".preview").replaceChildren(thumb);
      this.existing = false;
      // size ermitteln
      thumb.onload = () => {
        this.requestUpdate();
      };
    }
  }
  async upload(file) {
    this.remove_error();
    const blob = file; // new Blob([new Uint8Array(10 * 1024 * 1024)]); // any Blob, including a File
    //const uploadProgress = this.select("progress");
    let url = new URLSearchParams();
    url.append("name", file.name);

    const xhr = new XMLHttpRequest();
    const success = await new Promise((resolve) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          console.log("upload progress:", event.loaded / event.total);
          uploadProgress.value = (event.loaded / event.total) * 100;
        }
      });
      xhr.addEventListener("loadend", () => {
        resolve(xhr.readyState === 4 && xhr.status === 200);
      });
      xhr.open("POST", this.upload_url + "?" + url.toString(), true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.send(blob);
    });
    if (success) {
      try {
        let data = JSON.parse(xhr.response);
        if (data.res == "ok") {
        } else {
          this.handle_error(data.msg, "upload");
        }
      } catch (e) {
        this.handle_error(
          "Ergebnis konnte nicht verarbeitet werden.",
          "upload"
        );
      }
    } else {
      this.handle_error(
        `Es ist ein übertragungsfehler aufgetreten (${xhr.status})`,
        "upload"
      );
    }
    this.uploading = false;
    console.log("success:", success);
  }
  async upload_without_progress(file) {
    let url = new URLSearchParams();
    url.append("name", file.name);
    let res = await fetch(this.upload_url + "?" + url.toString(), {
      method: "POST",
      body: file,
    }).catch((e) => this.handle_error(e));
    this.uploading = false;
  }

  handleChange(e) {
    const file = e.target.files[0];
    // this.select("section").style.display = "block";
    // this.select("span").innerText = file.name;
    // this.dispatch("change", file);
    this.process(file);
  }

  async handleRemove() {
    this.remove_error();
    let res = await fetch(this.remove_url, {
      method: "POST",
    }).catch((e) => this.handle_error(e));
    if (res.ok) {
      let data = await res.json();
      if (!data.res == "ok") {
        this.handle_error(data.msg);
      } else {
        // this.select(".preview").innerHTML = "";
        this.thumb = null;
      }
    } else {
      this.handle_error(res.status);
    }
    this.existing = false;
    // this.dispatch("change", file);
  }

  handle_error(e, action) {
    if (action == "upload") {
      //this.select(".preview").innerHTML = "";
      this.thumb = null;
      this.existing = false;
    }
    console.log(e);
    this.error = e;
  }
  remove_error() {
    this.error = "";
  }

  dispatch(event, arg) {
    this.dispatchEvent(new CustomEvent(event, { detail: arg }));
  }
}

window.customElements.define("image-upload", ImageUpload);
