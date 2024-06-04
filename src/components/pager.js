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
      a {
        display: block;
        padding: 0.7rem;
        text-decoration: none;
        background: white;
        color: black;
      }
      a:hover {
        background: #f2f2f2;
      }
      a[active] {
        background: black;
        color: white;
      }
      a[active]:hover {
        background: #555;
      }
    `,
  ];
  _clickHandler(e) {
    console.log("++ click", e.target.textContent);
    // this.clicked = e.target.text;
    this.dispatchEvent(
      new CustomEvent("move-page", {
        detail: e.target.textContent,
        bubbles: true,
        composed: false,
      })
    );
  }
  render() {
    console.log("rendering PAGER", this.page);
    if (!this.total) return "";
    let pages = Math.ceil(this.total / this.limit);
    return html`<nav @click=${this._clickHandler}>
      <a href="javascript:;">prev</a>
      ${map(
        range(pages),
        (i) =>
          html`<a href="javascript:;" ?active=${i + 1 == this.page}
            >${i + 1}</a
          >`
      )}
      <a href="javascript:;">next</a>
    </nav>`;
  }
}

window.customElements.define("pi-pager", Pager);
