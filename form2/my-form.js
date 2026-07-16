import { LitElement, css, html, live } from "./lit-all.min.js";
import FInput from "./input.js";
import { form } from "./form.js";

export default class MyForm extends LitElement {
    createRenderRoot() {
        return this;
    }
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
        this.form.update_value("thename", "initial name")
    }

    current_value(ev) {
        let hf = this.querySelector("form");
        let fd = new FormData(hf);
        console.log("native date", fd);
        this.dbg = JSON.stringify(this.form.values);
    }
    update_input(ev) {
        console.log("upd", ev.detail);
        this.form.update_value(ev.detail.name, ev.detail.value);
        this.requestUpdate();
    }
    update_inputwa(ev) {
        console.log("upd", ev.detail);
        this.form.update_value("fname", ev.target.value);
    }
    set_otto() {
        this.form.update_value("thename", "otto");
        // this.dbg = JSON.stringify(this.form.values);
        this.requestUpdate();
    }
    reset() {
        this.form.update_value("thename", "");
        this.form.update_value("fname", "");
        // this.dbg = JSON.stringify(this.form.values);
        console.log("++ form", this.form, this.form.get_value("thename"));
        let inp = this.querySelector("f-input");
        let inp2 = this.querySelector("wa-input");
        console.log("finput", inp);
        if (inp) {
            //  inp.val = "";
        }
        if (inp2) {
            //  inp2.value = "";
        }
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
                <button type="button" @click=${this.set_otto}>set to otto</button>
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
