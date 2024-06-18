import { LitElement, css, html } from "./../vendor/lit-core.min.js";

let style = css`
  * {
    box-sizing: border-box;
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
  .flx {
    display: flex;
  }
  .media {
    width: 50px;
    height: 50px;
  }
  .media:empty {
    width: 0;
  }
  h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: normal;
  }
  .detail {
    font-size: 0.8rem;
  }
`;

export default class Preview extends LitElement {
  static properties = {
    panel: { type: Number },
    id: { reflect: true },
    active: { type: Boolean, reflect: true },
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
    return html`<div class="flx" @click=${this.open}>
      <div class="media"></div>
      <h2>${this.title}</h2>
      <div class="detail">
        <p></p>
      </div>
    </div>`;
  }
}
