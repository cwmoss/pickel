import { LitElement, css, html } from "lit";
import Base from "./base.js";
import { slugify_simple } from "../util.js";
/*
https://stackoverflow.com/questions/67068455/how-can-i-access-the-unamed-slot-content-in-web-components
https://stackoverflow.com/questions/56351274/how-to-pass-option-tags-to-a-custom-element-as-distributed-nodes-aka-slot-sl
*/
export default class PiString extends LitElement {
    createRenderRoot() {
        return this;
    }

    static properties = {
        complete: {},
        setup_options: { type: Object },
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

    connectedCallback() {
        super.connectedCallback();
        this.setup_once();
    }

    updated(changedProperties) {
        if (changedProperties.has("setup_options")) {
            this.setup = this.setup_options;
            this.setup_once();
        }
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
        if (this.options.list) {
            this.items = this.options.list;
        }
        this.initialValue = this.setup.initialValue;
        // this.set_value(this.setup.value);
        this.value = this.setup.value;
        if (
            this.setup.validation &&
            typeof this["set_validation"] === "function"
        ) {
            this.set_validation(this.setup.validation);
        }
        this.complete = true;
        this.build_element();
    }

    element;
    build_element() {
        let el = "pi-input";
        if (this.options.list && this.options.layout == "radio") {
            el = "pi-radios";
        } else {
            if (this.options.list) {
                el = "pi-select";
            }
        }
        this.element = document.createElement(el);
        this.element.setup = this.setup;
    }
    render() {
        if (!this.complete) return;
        return this.element;
    }
}

customElements.define("pi-string", PiString);
