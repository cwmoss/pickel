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

// https://master.dev/blog/form-associated-custom-elements-in-practice/#comment-72247

import { formcss } from "./form.css.js";

function syncInnerInputValidity(
    internals,
    inputEl,
    msg
) {
    // return;
    console.log("sync VALIDITY", inputEl?.name);
    if (!inputEl) return;

    if (!inputEl.validity.valid) {
        // We pass the inputEl as the "anchor" so the browser
        // knows where to point the validation bubble.
        internals.setValidity(inputEl.validity, msg ? msg : inputEl.validationMessage, inputEl);
    } else {
        internals.setValidity({});
    }
}

export default class Base extends LitElement {
    static formAssociated = true;

    empty_value = "";

    xcreateRenderRoot() {
        return this;
    }
    static properties = {
        value: {},
        // set values from the outside
        name: { reflect: true },
        label: {},
        noLabel: { type: Boolean, attribute: "no-label" },
        plain: { type: Boolean },
        inline: { type: Boolean },
        id: {},
        placeholder: {},
        originalType: {},
        options: { type: Object, attribute: false, noAccessor: true },
        initialValue: {},
        is_fresh: { type: Boolean, state: true },
        is_valid: { type: Boolean, state: true },
        required: { type: Boolean },
        m_required: { attribute: "m-required" },
        maxlength: {},
        pattern: {},
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
        this.value = this.empty_value;
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

    willUpdate(props) {
        console.log("++ Will update?", props, this.value);
    }

    updated(changedProperties) {

        if (changedProperties.has("value")) {
            console.log("++ UPDATED VALUE", this.form.id, this.is_fresh, this.name, this.value);
            this.internals.setFormValue(this.value ? this.value : null);
            if (!this.is_fresh)
                this._sync_validity()
        }
    }

    reset(val) {
        this.value = val ?? this.empty_value;
    }

    input_event(e) {
        console.log("INPUT EVENT static fresh", this.constructor.validate_on_input);
        this.is_fresh = false;
        this.value = this.get_input_value(e);
        if (this.constructor.validate_on_input) {
            // this.validate_event();
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

    get form() {
        return this.internals.form;
    }
    get validity() {
        if (this.is_fresh) {
            return true;
        }
        return this.internals.validity;
    }
    get validationMessage() {
        return this.internals.validationMessage;
    }
    get willValidate() {
        return this.internals.willValidate;
    }

    checkValidity() {
        return this.internals.checkValidity();
    }
    reportValidity() {
        return this.internals.reportValidity();
    }

    get native_el() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    _first_rendered = false;
    firstUpdated() {
        // this.native_el.setCustomValidity("You gotta fill this out, yo!");
        this._first_rendered = true
    }

    custom_message() {
        if (this.m_required && this.native_el.validity.valueMissing) return this.m_required;
        return "";
    }

    _sync_validity() {
        // Our utility helper doesn't care if it's an input, textarea, select, or checkbox
        syncInnerInputValidity(this.internals, this.native_el, this.custom_message(this.native_el));
        this.error_message = this.validationMessage
    }

    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }

    formResetCallback() {
        /* Subclasses override this */
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

    render_feedback() {
        return html`<label for="input" class="invalid-feedback">${this.error_message}</label>`
    }
}

// customElements.define("b-face", Face);
