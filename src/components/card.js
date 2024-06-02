import { LitElement, css, html } from "./../vendor/lit-core.min.js";
//import cssvars from "./variables.css.js";

// console.log("bootstrap import", cssvars);

export default class Card extends LitElement {
  static properties = {
    title: {},
    url: {},
    data: { type: Object },
    placeholder: {},
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
      }
      h1 {
        font-size: 1rem;
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

  connectedCallback() {
    super.connectedCallback();
    this.fetch_data();
  }

  async fetch_data() {
    console.log("fetching", this.url);
    let res = await fetch(this.url, { method: "GET", credentials: "include" });
    let data = await res.json();
    this.data = data;
  }

  render_body() {
    return html`<json-viewer
      style="--background-color: white;"
      .data=${this.data}
    ></json-viewer>`;
    // return html`<code>${JSON.stringify(this.data)}</code>`;
  }

  render() {
    return html`
      <article>
        <header><h1>${this.title}</h1></header>
        <div class="body">${this.render_body()}</div>
        <slot name="data" .title=${this.title} .data=${this.data}></slot>
        <footer></footer>
      </article>
    `;
  }
}

window.customElements.define("pi-card", Card);
