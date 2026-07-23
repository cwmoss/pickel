import { LitElement, css, html, nothing } from "../lit-all.min.js";
import Base from "./base.js";

export default class PiNumber extends Base {
    render() {
        console.log("render input", this.name);
        return html`
            ${this.render_label()}
            <input
                type="number"
                id="input"
                name=${this.name}
                value=${this._first_rendered ? nothing : (this.value ?? "")}
                .value=${!this._first_rendered ? nothing : (this.value ?? "")}
                @input=${this.input_event}
                ?required=${this.required}
            />
            ${this.render_feedback()}
        `;
    }
}

customElements.define("pi-number", PiNumber);
