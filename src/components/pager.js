import { LitElement, css, html, map, range } from "../vendor/lit-all.min.js";
//import cssvars from "./variables.css.js";

// console.log("bootstrap import", cssvars);

export default class Pager extends LitElement {
  static properties = {
    total: { type: Number },
    limit: { type: Number },
    page: { type: Number },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
        --border-color: #ccc;
      }
      nav {
        display: flex;
        gap: 0rem;
      }
      button {
        border: none;
        display: block;
        padding: 0.7rem;
        text-decoration: none;
        background: white;
        color: black;
      }
      button:hover {
        background: #f2f2f2;
      }
      button[active] {
        background: black;
        color: white;
      }
      button[active]:hover {
        background: #555;
      }
    `,
  ];
  _clickHandler(e) {
    console.log("++ click", e);
    if (!e.target.matches("button")) return;
    // this.clicked = e.target.text;
    this.dispatchEvent(
      new CustomEvent("move-page", {
        detail: e.target.getAttribute("p"),
        bubbles: true,
        composed: false,
      })
    );
  }
  render() {
    console.log("rendering PAGER", this.page);
    let page = parseInt(this.page);
    if (!page) page = 1;
    if (!this.total) return "";
    let pages = Math.ceil(this.total / this.limit);
    let prev = page > 1 ? page - 1 : 1;
    let next = page >= pages ? pages : page + 1;
    return html`<nav @click=${this._clickHandler}>
      <button type="button" p="${prev}">prev</button>
      <button type="button" p="${next}">next</button>

      ${map(
        range(pages),
        (i) =>
          html`<button type="button" p="${i + 1}" ?active=${i + 1 == this.page}>
            ${i + 1}
          </button>`
      )}
    </nav>`;
  }
}

window.customElements.define("pi-pager", Pager);
