import { LitElement, css, html, live } from "./lit-all.min.js";
import { PiInput } from "./elements/_index.js";
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
        this.form.update_value("fname", "Anna");
        this.form.update_value("lname", "mustermann");
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

    set_otto() {
        this.form.update_value("fname", "otto");
        // this.dbg = JSON.stringify(this.form.values);
        this.requestUpdate();
    }
    reset() {
        this.form.update_value("thename", "");
        this.form.update_value("fname", "");
        // this.dbg = JSON.stringify(this.form.values);
        this.requestUpdate();
    }
    render() {
        return html`
            <form @pi-input=${this.update_input} id="fcustom">
                <div class="actions-start">
                    <button type="button" @click=${this.current_value}>
                        state
                    </button>
                    <button type="button" @click=${this.reset}>reset</button>
                    <button type="button" @click=${this.set_otto}>
                        set to otto
                    </button>
                </div>
                <pi-input
                    type="text"
                    name="fname"
                    .value=${this.form.get_value("fname")}
                    label="First Name"
                ></pi-input>
                <pi-input
                    type="text"
                    name="lname"
                    value="mustermann"
                    label="Last Name"
                ></pi-input>
                <pi-date name="bday" label="Birthday"></pi-date>
            </form>
            <code>${this.dbg}</code>
        `;
    }
}

customElements.define("my-form", MyForm);
