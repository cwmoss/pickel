import { LitElement, css, html, nothing } from "./lit-all.min.js";
import { formcss } from "./form.css.js";

export default class TestInput extends HTMLElement {

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
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        console.log("render input", this.required, this.shadowRoot);
        let html = `<style>${formcss}</style><label for="input">label</label><input
                type="text"
                id="input"
                name="debugi"
                value=""

                required
    
            />
      
        `;
        this.shadowRoot.innerHTML = html
    }
}

customElements.define("test-input", TestInput);

/*
ValidityState { valueMissing: true, typeMismatch: false, patternMismatch: false, tooLong: false, tooShort: false, rangeUnderflow: false, rangeOverflow: false, stepMismatch: false, badInput: false, customError: false }

badInput: false
customError: false
patternMismatch: false
rangeOverflow: false
rangeUnderflow: false
stepMismatch: false
tooLong: false
tooShort: false
typeMismatch: false
valid: false
valueMissing: true


validationMessage

valueAsDate
valueAsNumber
*/
