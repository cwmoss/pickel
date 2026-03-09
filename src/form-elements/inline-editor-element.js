import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import api from "../lib/api.js";

let style = css`
    :host {
        display: inline-block;
        font-size: 0.8em;
        padding: 2px 0.5rem;
        background: silver;
        border-radius: 3px;
    }
`;

export default class InlineEditorElement extends Face {
    static properties = {
        ...Face.properties,
        val: { type: Object, reflect: true },
        prefix: {},
        suffix: {},
    };

    static styles = [style];

    render() {
        let val = JSON.stringify(this.val);
        return html`<output title="${val}">${val.substring(0, 20)}</output>`;
    }
}

customElements.define("inline-editor-element", InlineEditorElement);
