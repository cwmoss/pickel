import { LitElement, css, html, svg } from "../../vendor/lit-all.min.js";
import MultiUploadItem from "./multi-upload-item.js";

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
  }
  :host * {
    box-sizing: border-box;
  }
  :host([existing]) .drop,
  :host([uploading]) .drop {
    display: none;
  }
  :host(:not([existing])) {
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
    padding: 1rem;
    border: 0.3em dashed rgba(66, 66, 66, 0.15);
    border-radius: 0;
    cursor: pointer;
    display: grid;
    place-content: center;
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

  multi-upload-item {
    margin: 3px 0;
  }
`;

export default class MultiUpload extends LitElement {
  static properties = {
    files: { type: Array },
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

  handleChange(e) {
    this.files = [];
    console.log("$$$ upl url2", this.upload_url);
    for (const file of e.target.files) {
      let el = new MultiUploadItem();
      el.upload_url = this.upload_url;
      el.process(file);
      this.files.push(el);
    }
    //this.requestUpdate();

    // this.select("section").style.display = "block";
    // this.select("span").innerText = file.name;
    // this.dispatch("change", file);
    // this.process(file);
  }

  // remove element
  upload_ok(e) {
    console.log("upl ready", e, e.target);
    this.files = this.files.filter((item) => item !== e.target);
  }
  // html`<multi-upload-item .file=${f}></multi-upload-item>`
  render() {
    return html`<section class="choose">
        <input
          @change=${this.handleChange}
          hidden
          id="fileUpload"
          type="file"
          multiple
        />
        <progress max="100" value="0"></progress>
        <label for="fileUpload" class="drop"
          >${this.upload_label || "Select Files"}</label
        >
        <div class="message">${this.error}</div>
      </section>
      <section class="uploads" @image-uploaded=${this.upload_ok}>
        ${this.files?.map((f) => f)}
      </section> `;
  }

  process(file) {
    this.uploading = true;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      //creating a thumbnail
      this.set_preview(null, event.target.result, file.name);
      this.upload(file);
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

window.customElements.define("multi-upload", MultiUpload);
