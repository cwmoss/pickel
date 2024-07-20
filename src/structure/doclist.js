import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import api from "../lib/slow-hand.js";
import Panel from "./panel.js";
import Preview from "../slowhand/preview.js";
import Search from "../slowhand/search.js";

export default class Doclist extends Panel {
  async fetch_content(fts) {
    let content = [];
    let schema = await api.current_schema();
    console.log("+panel=>schema", this.index, schema);
    let docs = [];
    if (fts) {
      let res = await api.search(fts, this.title, true);
      docs = res.result;
    } else {
      docs = await api.documents(this.title, { preview: true });
    }

    docs.forEach((item) => {
      let el = new Preview();
      el.set_data(item, this.title);
      el.icon = "file-earmark";
      content.push(el);
    });

    this.content = content;
  }

  create() {
    let doc = { _id: crypto.randomUUID(), _type: this.title };
    this.dispatchEvent(
      new CustomEvent("open-preview", {
        detail: { panel: this.index, id: doc._id, create: doc },
        bubbles: 1,
        composed: 1,
      })
    );
  }
  async search(e) {
    console.log("TYPE search", e.detail);
    await this.fetch_content(e.detail);
  }
  render_actions() {
    return html`<pi-btn flat title="create" @click=${this.create}
      ><sl-icon name="plus-lg" style="font-size: 24px;"></sl-icon
    ></pi-btn>`;
  }
  render_head() {
    return html`<form-input
      plain
      @pi-input=${this.search}
      no-label
      .input_type=${"search"}
      decostart="search"
    ></form-input>`;
  }
}

customElements.define("pi-doclist", Doclist);
