import { LitElement, css, html } from "lit";
import Tagify from "../tagify.esm.js";
import Base from "./base.js";
import { tagstyles } from "./tagify.css.js";

let styles = css`
    .custom {
        --tags-border-color: var(--bs-border-color);
    }
    .tagify {
        border-width: var(--bs-border-width);
        border-radius: var(--bs-border-radius);
    }
`;

export default class PiTags extends Base {
    static styles = [...Base.styles, tagstyles, styles];

    get_input_value(e) {
        console.log("get select value", this.value); //  e.target.value
        return this.tagify.value.map((item) => item.value);
    }

    firstUpdated() {
        let inp = this.shadowRoot.querySelector("#tags");
        this.tagify = new Tagify(inp);
        //tagify.addTags(this.value);
    }

    render() {
        return html`${this.render_label("tags")}<input
                type="text"
                class="form-control custom"
                name="tags"
                id="tags"
                .value=${this.value}
                @change=${this.input_event}
            />
            ${this.render_feedback()} `;
    }
}

customElements.define("pi-tags", PiTags);
