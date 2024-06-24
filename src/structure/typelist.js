import { LitElement, css, html, classMap } from "./../vendor/lit-all.min.js";
import api from "../lib/slow-hand.js";
import Panel from "./panel.js";
import Preview from "../components/preview.js";

export default class Typelist extends Panel {
  async fetch_content() {
    let content = [];
    let schema = await api.current_schema();
    console.log("+panel=>schema", this.index, schema);

    schema.documents.forEach((item) => {
      let el = new Preview();
      el.set_data({ id: item.name, title: item.title });
      el.simple = true;
      el.icon = "folder";
      content.push(el);
    });

    this.content = content;
  }
}

customElements.define("pi-typelist", Typelist);
