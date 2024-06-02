import { LitElement, css, html } from "../vendor/lit-core.min.js";
//import cssvars from "./variables.css.js";

// console.log("bootstrap import", cssvars);

export default class Dl extends LitElement {
  static properties = {
    keys: { type: Array },
    data: { type: Array },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
      }
      dl {
        display: grid;
        grid-template-columns: max-content auto;
      }
      dl > * {
        padding: 0.5rem 1rem 0.5rem 0;
      }
      dt {
        grid-column-start: 1;
        font-weight: bold;
        border-bottom: 1px solid grey;
      }

      dd {
        grid-column-start: 2;
        margin: 0;
        border-bottom: 1px solid grey;
      }
    `,
  ];

  render() {
    if (!this.data) return "";
    return html`<dl>
      ${this.data.map((el) => {
        return html`<dt>${el[this.keys[0]]}</dt>
          <dd>${el[this.keys[1]]}</dd>`;
      })}
    </dl>`;
  }
}

window.customElements.define("pi-dl", Dl);
