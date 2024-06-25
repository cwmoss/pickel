import { LitElement, css, html } from "../../vendor/lit-core.min.js";

//import cssvars from "./variables.css.js";
// console.log("bootstrap import", cssvars);

export default class Card extends LitElement {
  static properties = {
    title: {},
    url: {},
    api: {},
    data: { type: Object },
    placeholder: {},
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
        border-left: 2px solid black;
        background: white;
      }
      json-viewer {
        --background-color: white;
      }
      article > div {
        padding: 1rem;
      }
      header h1 {
        font-size: 0.75rem;
        padding: 0.5rem;
        line-height: 0.75rem;
        font-weight: bold;
        display: inline-block;
        background: black;
        color: white;
        margin: 0;
      }

      footer {
        font-size: 0.75rem;
        padding: 0.5rem;
        /* border-bottom: 2px solid black; */
      }
    `,
  ];

  render() {
    return html`
      <article>
        <header>
          <h1>
            <slot name="header">${this.title}</slot>
          </h1>
        </header>
        <div class="body"><slot></slot></div>
        <footer><slot name="footer"></slot></footer>
      </article>
    `;
  }
}

window.customElements.define("pi-card", Card);
