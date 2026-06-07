import { LitElement, css, html } from "./../vendor/lit-core.min.js";
import FInput from "./input.js";
import { form } from "./form.js";

export default class MyForm extends LitElement {
    static properties = {
        form: { type: Object },
        error_message: {},
        dbg: { state: true },
        // rules: { type: Array },
        // opts: { attribute: false },
    };

    connectedCallback() {
        super.connectedCallback();
        this.form = new form();
    }

    current_value(ev) {
        this.dbg = JSON.stringify(this.form.values);
    }
    update_input(ev) {
        console.log("upd", ev.detail);
        this.form.update_value(ev.detail.name, ev.detail.value);
    }

    reset() {
        this.form.update_value("thename", "");
        this.requestUpdate();
    }
    render() {
        return html`
            <form @pi-input=${this.update_input}>
                <button type="button" @click=${this.current_value}>
                    state
                </button>
                <button type="button" @click=${this.reset}>reset</button>
                <f-input
                    type="text"
                    name="thename"
                    .value=${this.form.get_value("thename")}
                    label="Name"
                ></f-input>
            </form>
            <code>${this.dbg}</code>
        `;
    }
}

customElements.define("my-form", MyForm);
