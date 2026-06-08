import { LitElement, css, html, live } from "./lit-all.min.js";
import Base from "./base.js";

export default class FInput extends Base {
    render() {
        console.log("render input");
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
