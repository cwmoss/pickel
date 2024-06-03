import { LitElement, css, html } from "./../vendor/lit-core.min.js";

import api from "./../lib/slow-hand.js";

//import cssvars from "./variables.css.js";

// console.log("bootstrap import", cssvars);

export default class MediaWidget extends LitElement {
  static properties = {
    assets: [],
    total: { type: Number },
    page: { type: Number },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
      }
      .body {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
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
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.fetch_data();
  }

  async fetch_data() {
    let res, assets;
    let type = "image";
    let q = `q(_type=="${type == "image" ? "sh.image" : "sh.file"}")`;
    res = await api.query(q, { count: true, limit: 36 });
    console.log("result", res.pageinfo.total, res.result.length);
    this.total = res.pageinfo.total;
    this.page = 1;
    this.assets = res.result;
  }

  render_body() {
    return html`<json-viewer
      style="--xxbackground-color: white;"
      .data=${this.data}
    ></json-viewer>`;
    // return html`<code>${JSON.stringify(this.data)}</code>`;
  }

  render() {
    return html`
      <section>
        <header>suche --- pager</header>
        <div class="body">
          ${this?.assets?.map((img) => {
            return html`<div class="item">
              <img src="${api.images()}/${img.path}?size=150x150&mode=fit" />
            </div>`;
          })}
        </div>
        <footer></footer>
      </section>
    `;
  }
}

window.customElements.define("media-widget", MediaWidget);
