import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import { resolve_path } from "../lib/util.js";

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

export default class ObjectPreview extends LitElement {
  static properties = {
    active: { type: Boolean, reflect: true },
    simple: { type: Boolean, reflect: true },
    icon: {},
    title: {},
    subtitle: {},
    media: {},
    data: { type: Object },
    schema: { type: Object },
  };

  static styles = [style];

  set_data(data, schema) {
    this.schema = schema;
    if (schema?.preview?.title)
      this.title = resolve_path(data, schema.preview.title);
    if (schema?.preview?.subtitle)
      this.subtitle = resolve_path(data, schema.preview.subtitle);
    if (schema?.preview?.media)
      this.media = resolve_path(data, schema.preview.media);
    console.log("$$ preview data", data);
    this.data = data;
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
    if (this.media) media = html`<img src="${this.media}" />`;
    else if (this.icon) media = html`<sl-icon name="${this.icon}"></sl-icon>`;
    return html`<div class="flx" @click=${this.open}>
      <div class="media">${media}</div>
      <div>
        <h2 title="${this.title}">${this.title}</h2>
        ${this.simple
          ? ""
          : html` <div class="detail">
              <p>${detail}</p>
            </div>`}
      </div>
    </div>`;
  }
}

customElements.define("pi-object-preview", ObjectPreview);
