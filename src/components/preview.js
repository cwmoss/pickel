import { LitElement, css, html } from "./../vendor/lit-core.min.js";

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
    width: 50px;
    height: 50px;
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

// TODO: remove panel // panel_index

export default class Preview extends LitElement {
  static properties = {
    panel: { type: Number },
    id: { reflect: true },
    active: { type: Boolean, reflect: true },
    simple: { type: Boolean, reflect: true },
    icon: {},
    title: {},
    data: { type: Object },
  };

  static styles = [style];

  set_data(data, panel_index) {
    this.id = data.id ?? data._id ?? data.name ?? data.title;
    this.title = data.title ?? data.name ?? this.id;
    this.data = data;
    this.panel = panel_index;
  }
  open() {
    this.active = true;
    this.dispatchEvent(
      new CustomEvent("open-preview", {
        detail: { panel: this.panel, id: this.id },
        bubbles: 1,
        composed: 1,
      })
    );
  }
  render() {
    let detail = this.id;
    let media = "";
    if (this.icon) media = html`<sl-icon name="${this.icon}"></sl-icon>`;
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
