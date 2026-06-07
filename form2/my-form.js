import { LitElement, css, html } from "./lit-core.min.js";
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
        let hf = this.shadowRoot.querySelector("form");
        let fd = new FormData(hf);
        console.log("native date", fd);
        this.dbg = JSON.stringify(this.form.values);
    }
    update_input(ev) {
        console.log("upd", ev.detail);
        this.form.update_value(ev.detail.name, ev.detail.value);
    }
    update_inputwa(ev) {
        console.log("upd", ev.detail);
        this.form.update_value("fname", ev.target.value);
    }
    reset() {
        this.form.update_value("thename", "");
        this.form.update_value("fname", "");
        console.log("++ form", this.form, this.form.get_value("thename"));
        let inp = this.shadowRoot.querySelector("f-input");
        let inp2 = this.shadowRoot.querySelector("wa-input");
        console.log("finput", inp);
        inp.reset();
        inp2.value = "";
        this.requestUpdate();
    }
    render() {
        console.log("render FORM", this.form.get_value("thename"));
        return html`
            <form @pi-input=${this.update_input}>
                <button type="button" @click=${this.current_value}>
                    state
                </button>
                <button type="button" @click=${this.reset}>reset</button>
                <f-input
                    type="text"
                    name="thename"
                    .val=${this.form.get_value("thename")}
                    label="Name"
                ></f-input>
                <wa-input
                    name="fname"
                    label="What is your name?"
                    @input=${this.update_inputwa}
                    .value=${this.form.get_value("fname")}
                ></wa-input>
            </form>
            <code>${this.dbg}</code>
        `;
    }
}

customElements.define("my-form", MyForm);
