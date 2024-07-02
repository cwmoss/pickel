import { LitElement, css, html } from "../../vendor/lit-all.min.js";
// import Pager from "./pager.js";
import api from "../lib/slow-hand.js";
import urlStore from "../lib/url-store.js";
import FocusPicker from "../misc/focus-picker.js";
//import cssvars from "./variables.css.js";

// console.log("bootstrap import", cssvars);

export default class MediaWidget extends LitElement {
  static properties = {
    assets: [],
    total: { type: Number },
    page: { type: Number },
    loading: { type: Boolean },
    edit: { type: Boolean },
    picker: { type: Boolean, reflect: true },
    item: { type: Object },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
      }
      :host([picker]) .item img:hover {
        outline: 8px solid var(--color-accent);
      }
      header {
        margin-bottom: 1rem;
        display: flex;
        gap: 1rem;
      }
      .body {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .body[loading] {
        opacity: 40%;
      }
      .item,
      img {
        width: 150px;
      }

      /* Settings start */
      .justified-grid-gallery {
        --space: 4px;
        --min-height: 190px;
        --last-row-background: rgb(188 234 153);
      }
      /* Settings end */

      .justified-grid-gallery {
        display: flex;
        flex-wrap: wrap;
        grid-gap: var(--space);
        list-style: none;
        margin: 0 !important; /* We use !important to avoid gaps in some environments. */
        padding: 0 !important; /* We use !important to avoid gaps in some environments. */
      }

      .justified-grid-gallery > * {
        flex-grow: calc(var(--width) * (100000 / var(--height)));
        flex-basis: calc(var(--min-height) * (var(--width) / var(--height)));
        aspect-ratio: var(--width) / var(--height);
        position: relative;
        overflow: hidden;
        margin: 0 !important; /* We use !important to avoid gaps in some environments. */
        padding: 0 !important; /* We use !important to avoid gaps in some environments. */
      }

      .justified-grid-gallery > * > img {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .justified-grid-gallery::after {
        content: " ";
        flex-grow: 1000000000;
        background: var(--last-row-background);
      }

      dialog {
        top: 0;
        left: 0;
        width: 90vw;
        height: 90vh;
      }
      ::backdrop {
        background: black;
        opacity: 60%;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.fetch_data();
  }

  async fetch_data(page) {
    this.loading = true;
    this.assets = [];
    if (!this.limit) this.limit = 48;
    if (!page) page = urlStore.get_parameter("p");
    if (page) this.page = page;
    if (!this.page) this.page = 1;
    let res, assets;
    let type = "image";
    let q = `q(_type=="${
      type == "image" ? "sh.image" : "sh.file"
    }")order(_createdAt desc)`;
    res = await api.query(q, {
      count: true,
      limit: this.limit,
      page: this.page,
    });
    console.log("result", res.pageinfo.total, res.result.length);
    this.total = res.pageinfo.total;
    this.assets = res.result;
    this.loading = false;
  }

  move_page(e) {
    console.log("+++move", e.detail);
    urlStore.set_parameter("p", e.detail);
    this.fetch_data(e.detail);
  }

  start_edit(e) {
    console.log("++ dblclick", e);
    if (!e.target.matches("img")) return;
    let id = e.target.getAttribute("id");
    this.item = this.assets.find((img) => img._id == id);
    if (this.picker) {
      this.dispatchEvent(
        new CustomEvent("close-dialog", { bubbles: true, composed: true })
      );
      this.dispatchEvent(
        new CustomEvent("pick-image", {
          detail: this.item,
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.edit = true;
      this.shadowRoot.querySelector("dialog").showModal();
    }
  }
  render_body() {
    return html`<json-viewer
      style="--xxbackground-color: white;"
      .data=${this.data}
    ></json-viewer>`;
    // return html`<code>${JSON.stringify(this.data)}</code>`;
  }

  render_editor() {
    return html`<dialog>
      ${this.item
        ? html`<json-viewer .data=${this.item}></json-viewer>
            <focus-picker
              img="${api.images()}/${this.item.path}"
            ></focus-picker>`
        : ""}
    </dialog>`;
  }

  files_dropped(e) {
    console.log("new files...", e.detail);
  }
  /*
  <pi-pager
            limit="12"
            .page=${this.page}
            .total=${this.total}
          ></pi-pager>
          */
  render() {
    console.log("rendering", this.page);
    return html`
      <window-drop @files-dropped=${this.files_dropped}></window-drop>
      <section>
        <header>
          <div>suche</div>
          <pi-pager
            @move-page=${this.move_page}
            .limit=${this.limit}
            .page=${this.page}
            .total=${this.total}
          ></pi-pager>
        </header>
        <div class="body" ?loading=${this.loading} @dblclick=${this.start_edit}>
          ${this?.assets?.map((img) => {
            return html`<div class="item">
              <img
                id="${img._id}"
                src="${api.images()}/${img.path}?size=150x150&mode=fit"
              />
            </div>`;
          })}
        </div>
        ${this.render_editor()}
        <footer></footer>
      </section>
    `;
  }
}

customElements.define("media-widget", MediaWidget);
