import { LitElement, css, html } from "./../vendor/lit-core.min.js";
import Base from "./base.js";

export default class FInput extends Base {
    render() {
        return html`
            ${this.render_label()}
            <input
                type="text"
                id="input"
                name=${this.name}
                .value=${this.value}
                @input=${this.input_event}
            />
        `;
    }
}

customElements.define("f-input", FInput);
