import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import api from "../lib/api.js";

let style = css`
    :host {
        display: block;
        font-size: 0.8em;
        padding: 2px 0.5rem;
        background: silver;
        border-radius: 3px;
    }
`;

export default class EditorBlockElement extends Face {
    static properties = {
        ...Face.properties,
        shid: { type: String, reflect: true, attribute: "shid" },
        prefix: {},
        suffix: {},
    };

    static styles = [style];

    render() {
        let val = JSON.stringify(this.val);
        return html`<output title="${val}">${this.shid}</output>`;
    }
}

customElements.define("editor-block-element", EditorBlockElement);
