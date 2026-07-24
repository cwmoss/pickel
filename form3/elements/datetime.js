import { LitElement, css, html, live } from "../lit-all.min.js";
import Base from "./base.js";

export default class PiDatetime extends Base {
    render() {
        console.log("render input");
        return html`
            ${this.render_label()}
            <input
                type="datetime-local"
                id="input"
                name=${this.name}
                .value=${this.value ?? ""}
                @input=${this.input_event}
                ?required=${this.required}
            />
            ${this.render_feedback()}
        `;
    }
}

customElements.define("pi-datetime", PiDatetime);
