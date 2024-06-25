import { LitElement, css, html } from "../../vendor/lit-core.min.js";
//import cssvars from "./variables.css.js";

// console.log("bootstrap import", cssvars);

export default class Dl extends LitElement {
  static properties = {
    keys: {
      type: Array,
      converter: (value, type) => {
        if (value.substring(0, 1) == "[") {
          return JSON.parse(value);
        } else {
          return value.split(",");
        }
      },
    },
    data: { type: Array },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
        --border-color: #ccc;
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
        border-bottom: 1px solid var(--border-color);
      }

      dd {
        grid-column-start: 2;
        margin: 0;
        border-bottom: 1px solid var(--border-color);
      }
    `,
  ];

  render_object() {
    return html`<dl>
      ${this.keys.map((k) => {
        return html`<dt>${k}</dt>
          <dd>${this.data[k]}</dd>`;
      })}
    </dl>`;
  }
  render() {
    if (!this.data) return "";
    console.log("is array?", Array.isArray(this.data));
    if (!Array.isArray(this.data)) {
      return this.render_object();
    }
    return html`<dl>
      ${this.data.map((el) => {
        return html`<dt>${el[this.keys[0]]}</dt>
          <dd>${el[this.keys[1]]}</dd>`;
      })}
    </dl>`;
  }
}

window.customElements.define("pi-dl", Dl);
