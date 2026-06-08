import { LitElement, css, unsafeCSS, html } from "./lit-core.min.js";
// import cssvars from "./variables.css.js";
// import { bootstrapform } from "./bs-only-form.css.js";
// import FieldValidator from "../st.bernard/field-validator.js";
// console.log("bootstrap import", cssvars);
/*let res = await fetch(import.meta.url + "/../form.css");
let css_c = await res.text();
let formglobal = unsafeCSS`
    ${css_c}
`;*/
import { formcss } from "./form.css.js";

export default class Base extends LitElement {
    static formAssociated = true;

    empty_value = "";

    static properties = {
        value: { state: true },
        // set values from the outside
        // val: {},
        name: { reflect: true },
        label: {},
        noLabel: { type: Boolean, attribute: "no-label" },
        plain: { type: Boolean },
        inline: { type: Boolean },
        id: {},
        placeholder: {},
        originalType: {},
        options: { type: Object, attribute: false, noAccessor: true },
        initialValue: { noAccessor: true },
        is_fresh: { type: Boolean, state: true },
        is_valid: { type: Boolean, state: true },
        error_message: {},
        // rules: { type: Array },
        // opts: { attribute: false },
    };

    static styles = [
        formcss,
        // cssvars,
        // formglobal,
        css``,
    ];

    constructor() {
        super();
        this.is_fresh = true;
        this.is_valid = true;
        this.internals = this.attachInternals();
        // this.internals.setFormValue(this.value);
    }

    connectedCallback() {
        super.connectedCallback();
        this.setup_once();
    }

    _setup_run = false;
    setup_once() {
        if (!this.setup) return;
        if (this._setup_run) return;
        this._setup_run = true;
        this.label = this.setup.label;
        this.name = this.setup.name;
        this.id = this.setup.id;
        this.originalType = this.setup.originalType;
        this.options = this.setup.options || {};
        this.initialValue = this.setup.initialValue;
        this.set_value(this.setup.value);
        if (
            this.setup.validation &&
            typeof this["set_validation"] === "function"
        ) {
            this.set_validation(this.setup.validation);
        }
    }

    get_default_value() {
        console.log("$FACE default value", this.initialValue, this.name);
        return this.initialValue;
    }

    is_empty() {
        return !this.value || this.value == "";
    }
    /*
    set value(v) {
      console.log("++FACE set value", v);
      this.internals.setFormValue(v);
    }
    */

    set val(val) {
        console.log("VAL SET default value", val);
        this.value = val ?? this.empty_value;
    }
    set_value(val) {
        console.log("$$FACE set value", this.name, val);
        if (!val) val = this.get_default_value();
        this.value = val;
    }
    get_value() {
        console.log("$$FACE get value", this.name);
        // if (typeof this["get_updated_data"] === "function")
        //    return this.get_updated_data();
        return this.value;
    }

    willUpdate(props) {
        console.log("++ Will update?", props, this.value);
    }
    updated(changedProperties) {
        console.log("++ UPDATED propupdate", changedProperties, this.value);
        if (changedProperties.has("val")) {
            console.log("+++ upd EXTERNAL VALUE", this.val);
            this.value = this.val;
        }
        if (changedProperties.has("value")) {
            this.internals.setFormValue(this.value);
        }
    }
    reset(val) {
        this.value = val ?? this.empty_value;
    }
    input_event(e) {
        console.log("static fresh", this.constructor.validate_on_input);
        this.is_fresh = false;
        this.value = this.get_input_value(e);
        if (this.constructor.validate_on_input) {
            this.validate_event();
        }
        //e.stopPropagation();
        const evt = new CustomEvent("pi-input", {
            detail: { name: this.name, value: this.value },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(evt);
    }
    get_input_value(e) {
        return e.target.value;
    }

    set_validation(rules) {
        this.validator = new FieldValidator(rules);
    }

    validate_sync() {
        if (!this.validator) return true;
        this.is_fresh = false;
        let val = this.get_updated_data();
        let ok = this.validator.validate_sync(val, this);
        if (ok === true) {
            this.is_valid = true;
            this.error_message = "";
        } else {
            this.is_valid = false;
            this.error_message = ok;
        }
        console.log("validation result", ok);
        return ok;
    }

    async validate() {
        if (!this.validator) return true;
        let val = this.get_updated_data();
        let ok = await this.validator.validate(val, this);
        if (ok === true) {
            this.is_valid = true;
            this.error_message = "";
        } else {
            this.is_valid = false;
            this.error_message = ok;
        }
        console.log("validation result", ok);
        return ok;
    }
    async validate_event() {
        if (this.is_fresh) {
            return true;
        }
        return await this.validate();
    }
    wrap(h, classn) {
        if (!classn) classn = "fgroup";
        return html`<div class=${classn}>${h}</div>`;
    }

    render_label() {
        return !this.noLabel && !this.plain
            ? html`<label for="input" class="form-label">${this.label}</label>`
            : "";
    }
}

// customElements.define("b-face", Face);
