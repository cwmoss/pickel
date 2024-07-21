import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import api from "../lib/slow-hand.js";
import schema from "../lib/schema.js";

let style = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :host {
    display: block;
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid rgba(134, 144, 160, 0.4);
  }
  :host([active]) {
    /* border:1px solid red; */
    background-color: var(--color-accent);
  }
  :host(:not([active]):hover) {
    cursor: pointer;
    background-color: #eee;
  }
  .flx {
    display: flex;
  }
  .flx > * {
    min-width: 0;
  }
  sl-icon {
    display: block;
    margin: 0 auto;
  }
  .media {
    align-content: center;
    text-align: center;
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-right: 0.2rem;
  }
  :host([simple]) .media {
    height: auto;
    width: 24px;
  }
  .media:empty {
    width: 0;
  }
  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: black;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .detail {
    text-overflow: ellipsis;
    font-size: 1rem;
    color: #666;
  }
`;

export default class Preview extends LitElement {
  static properties = {
    id: { reflect: true },
    active: { type: Boolean, reflect: true },
    simple: { type: Boolean, reflect: true },
    icon: {},
    title: {},
    subtitle: {},
    media: {},
    data: { type: Object },
  };

  static styles = [style];

  set_data(data, type) {
    if (!data) return;
    console.log("$$ preview data", data, type);
    this.id = data.id ?? data._id ?? data.name ?? data.title;
    this.data = data;
    //if (!this.icon) {
    this.dummy = schema.get_icon(data._type ?? null);
    // console.log("$preview icon", this.icon, schema.get_type(data._type));
    //}
    let schema_preview;
    schema_preview = schema.get_preview(data);
    if (schema_preview) {
      console.log("$$ yes schema data", schema_preview);
      this.title = schema_preview.title;
      this.subtitle = schema_preview.subtitle;
      this.media = schema_preview.media;

      return;
    }
    console.log("$$ no schema data");
    this.title = data.title ?? data.name ?? this.id;
    this.subtitle = data.subtitle ?? data?.slug?.current ?? this.id;
    this.media = data.image ?? data.media ?? null;
    if (this.media) {
      this.media = api.imageurl_from_ref(this.media, { preview: true });
    }
  }
  open() {
    this.active = true;
    this.dispatchEvent(
      new CustomEvent("open-preview", {
        detail: { id: this.id },
        bubbles: 1,
        composed: 1,
      })
    );
  }
  render() {
    let detail = this.subtitle;
    let media = "";
    let icon = this.dummy;
    if (!icon) icon = this.icon;
    if (this.media) media = html`<img src="${this.media}" />`;
    else if (icon)
      media = html`<sl-icon name="${icon}" style="font-size:20px;"></sl-icon>`;
    return html`<div class="flx" @click=${this.open}>
      <div class="media">${media}</div>
      <div>
        <h2 title="${this.title}">${this.title ?? this._id}</h2>
        ${this.simple
          ? ""
          : html` <div class="detail">
              <p>${detail}</p>
            </div>`}
      </div>
    </div>`;
  }
}

customElements.define("pi-preview", Preview);
