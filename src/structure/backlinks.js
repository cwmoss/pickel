import { LitElement, css, html, classMap } from "../../vendor/lit-all.min.js";
import project from "../lib/project.js";
import api from "../lib/api.js";
import Panel from "./panel.js";
import Preview from "../slowhand/preview.js";

export default class Backlinkslist extends Panel {
    async fetch_content() {
        let content = [];
        let schema = project.schema();
        console.log("+Backlinkslist panel=>schema", this.index, this.node.parent_id, schema);

        let docs = await api.backlinks(this.node.parent_id);

        docs.forEach((item) => {
            let el = new Preview();
            el.set_data(item, this.title);
            el.icon = "file-earmark";
            content.push(el);
        });

        this.content = content;
    }

    render_actions() {
        return html`
        <pi-close @click=${this.close}></pi-close>
        `;
    }
}

customElements.define("pi-backlinks-panel", Backlinkslist);
