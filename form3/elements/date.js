import { LitElement, css, html, live } from "../lit-all.min.js";
import Base from "./base.js";

export default class PiDate extends Base {
    render() {
        console.log("render input");
        return html`
            ${this.render_label()}
            <input
                type="date"
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

customElements.define("pi-date", PiDate);
