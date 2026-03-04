import { LitElement, css, html, classMap } from "../../vendor/lit-all.min.js";
import project from "../lib/project.js";
import api from "../lib/api.js";
import Panel from "./panel.js";
import Preview from "../slowhand/preview.js";

export default class RevisionsPanel extends Panel {

    async fetch_content() {
        let content = [];
        let schema = project.schema();
        console.log("+RevisionsPanel panel=>schema", this.index, this.node.parent_id, schema);

        let revs = await api.revisions(this.node.parent_id);

        revs.forEach((item) => {
            content.push(this.render_revision(item));
        });

        this.content = content;
    }

    render_revision(it) {
        return html`<li>${it.action} ${it.actionAt}</li>`;
    }

    render_actions() {
        return html`
        <pi-close @click=${this.close}></pi-close>
        `;
    }
}

customElements.define("pi-revisions-panel", RevisionsPanel);
