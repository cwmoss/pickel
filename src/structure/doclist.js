import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import api from "../lib/slow-hand.js";
import Panel from "./panel.js";
import Preview from "../slowhand/preview.js";
import Search from "../slowhand/search.js";

export default class Doclist extends Panel {
  async fetch_content() {
    let content = [];
    let schema = await api.current_schema();
    console.log("+panel=>schema", this.index, schema);

    let docs = await api.documents(this.title, { preview: true });
    docs.forEach((item) => {
      let el = new Preview();
      el.set_data(item);
      el.icon = "file-earmark";
      content.push(el);
    });

    this.content = content;
  }

  render_actions() {
    return html`<button title="create">+</button>`;
  }
  render_head() {
    return html`<pi-search></pi-search> `;
  }
}

customElements.define("pi-doclist", Doclist);
