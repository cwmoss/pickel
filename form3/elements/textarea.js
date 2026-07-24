import { LitElement, css, html, nothing } from "lit";
import Base from "./base.js";

export default class PiTextarea extends Base {
    static properties = {
        ...Base.properties,
        size: {},
    };

    render() {
        let [cols, rows] = (this.size || "").split("x", 2);
        console.log("render PiTextarea", this.name);
        return html`
            ${this.render_label()}
            <textarea
                @input=${(e) => this.input_event(e)}
                @focusout=${this.validate_event}
                xclass="form-control"
                placeholder="${this.placeholder ?? ""}"
                cols="${cols ?? 50}"
                rows="${rows ?? 5}"
                id="input"
            >
${this.value}</textarea
            >
            <slot name="footer"></slot>
            ${this.render_feedback()}
        `;
    }
}

customElements.define("pi-textarea", PiTextarea);
