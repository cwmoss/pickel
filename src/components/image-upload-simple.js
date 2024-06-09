// Create template
const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
<path
    class="path1"
    d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
></path>
</svg>
`;
const template = document.createElement("template");

template.innerHTML = /*html*/ `
  <style>
      :host {
        font-size: 13px;
        font-family: arial;
      }
      article {
          display: flex;
          align-items: center;
      }
      xlabel {
        background-color: rgb(239, 239, 239);
        border: 1px solid rgb(118, 118, 118);
        padding: 2px 6px 2px 6px;
        border-radius: 2px;
        margin-right: 5px;
      }
      button {
          border:0;
          /* background: transparent; */
          color:black;
          cursor: pointer;
      }
      button.remove{
        width:100px;
      }
      button.remove::before {
          content: '\\2716';
      }
      .container{
        width: 250px;
        height:250px;
        
        box-sizing: border-box;
        margin: 0;
        
        overflow: hidden;
        position:relative;
      }
      .drop{
        position: relative;
        z-index: 1005;
        /* pointer-events: none; */
        box-sizing: border-box;
        margin: 1em auto;
            margin-bottom: 1em;
        padding: .5em;
        border: .3em dashed rgba(66,66,66,.15);
        border-radius: 0;
        width: calc(100% - 2.5em);
        height: calc(100% - 2.5em);
       /* display: table; */
        vertical-align: middle;
        text-align: center;
        display:block;
        cursor: pointer;
      }
      
      .preview{
        position:absolute;
        background-color:rgba(199, 199, 199, 0.25);
        z-index:1001;
        width: 100%;
        height: 100%;
      }
      .details{
        position:absolute;
        display:flex;
        z-index:1002;
        bottom: 0;
        width: 80%;
        padding: 1rem;
        background-color: #ffffffde;
        color: black;
        border-radius: 3px;
      }
      .descr{
        overflow:hidden;
      }
      .preview img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      label svg{
        position: absolute;
        inset: 42% 42%;
        cursor: pointer;
      }
      .message{
        position:absolute;
        z-index:1010;
        bottom: 1rem;
        left: 1rem;
        width: 75%;

        padding: 1rem;
        background-color: #ef8f8f;
        color: white;
        border-radius: 3px;
      }
      progress{
        border:none;
        height:3px;
        width: 100%;
      }
      .message:empty{
        display:none;
      }
      section[existing] .drop, section[uploading] .drop{
        display:none;
      }
      section:not([existing]) .details{
        display:none;
      }
      section[uploading] .preview{
        opacity:50%;
      }
      section:not([uploading]) progress{
        display:none;
      }
      [hidden]{
        display:none;
      }
  </style>
  <section>
    <input hidden id="fileUpload" type="file">
    <div class="container">
        <progress max="100" value="0"></progress>
        <div class="preview"></div>
        <div class="details"><div class="descr"></div><button class="remove">remove</button></div>
        <label for="fileUpload" class="drop">${icon}</label>
        <div class="message"></div>
    </div>
  </section>
  
  
`;

export default class ImageUpload extends HTMLElement {
  constructor() {
    // Inititialize custom component
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.upload_url = this.getAttribute("upload");
    this.remove_url = this.getAttribute("remove");
    // Add event listeners
    this.select("input").onchange = (e) => this.handleChange(e);
    this.select("button.remove").onclick = () => this.handleRemove();
    this.set_preview(this.getAttribute("existing"));
  }

  process(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      //creating a thumbnail
      this.set_preview(null, event.target.result, file.name);
      this.select("section").setAttribute("uploading", "");
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
    if (thumb) {
      this.select(".preview").replaceChildren(thumb);
      this.select("section").setAttribute("existing", "");

      thumb.onload = () => {
        console.log("++existing loaded", thumb);
        this.select(
          ".descr"
        ).innerHTML = `${name}<br>${thumb.naturalWidth} x ${thumb.naturalHeight} px`;
      };
    }
  }
  async upload(file) {
    this.remove_error();
    const blob = file; // new Blob([new Uint8Array(10 * 1024 * 1024)]); // any Blob, including a File
    const uploadProgress = this.select("progress");
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
    this.select("section").removeAttribute("uploading");
    console.log("success:", success);
  }
  async upload_without_progress(file) {
    let url = new URLSearchParams();
    url.append("name", file.name);
    let res = await fetch(this.upload_url + "?" + url.toString(), {
      method: "POST",
      body: file,
    }).catch((e) => this.handle_error(e));
    this.select("section").removeAttribute("uploading");
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
        this.select(".preview").innerHTML = "";
        this.select(".descr").innerHTML = "";
      }
    } else {
      this.handle_error(res.status);
    }
    this.select("section").removeAttribute("existing");
    // this.dispatch("change", file);
  }

  handle_error(e, action) {
    if (action == "upload") {
      this.select(".preview").innerHTML = "";
      this.select(".descr").innerHTML = "";
      this.select("section").removeAttribute("existing");
    }
    console.log(e);
    this.select(".message").innerHTML = e;
  }
  remove_error() {
    this.select(".message").innerHTML = "";
  }
  static get observedAttributes() {
    return ["upload-label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "upload-label") {
      if (newValue && newValue !== "") {
        this.select("label").innerText = newValue;
      }
    }
  }

  dispatch(event, arg) {
    this.dispatchEvent(new CustomEvent(event, { detail: arg }));
  }

  get select() {
    return this.shadowRoot.querySelector.bind(this.shadowRoot);
  }
}
