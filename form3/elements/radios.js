import { LitElement, css, html } from "lit";
import Base from "./base.js";
import { slugify_simple } from "../util.js";
/*
https://stackoverflow.com/questions/67068455/how-can-i-access-the-unamed-slot-content-in-web-components
https://stackoverflow.com/questions/56351274/how-to-pass-option-tags-to-a-custom-element-as-distributed-nodes-aka-slot-sl
*/

const is_object = (x) => {
    return typeof x === "object" && !Array.isArray(x) && x !== null;
};

export default class PiRadios extends Base {
    static properties = {
        ...Base.properties,
        end: { type: Boolean },
        horizontal: { type: Boolean },
        items: {
            type: Array,

            converter: (value, type) => {
                if (value.substring(0, 1) == "[") {
                    return JSON.parse(value);
                } else {
                    return value.split(",");
                }
                // return ["x", "y"];
            },
        },
        slotitems: { type: Array },
    };

    connectedCallback() {
        super.connectedCallback();

        let slots_all = this.querySelectorAll("option");
        // console.log(slots_all);
        if (slots_all.length)
            slots_all.forEach((opt) => {
                if (opt.value == this.value) opt.setAttribute("selected", "");
                this.slotitems = slots_all;
            });
    }

    get_input_value(e) {
        console.log("get select value", this.value, e.target.value);
        return e.target.value;
    }

    get_default_value() {
        return "";
    }

    render_label() {
        return !this.noLabel && !this.plain
            ? html`<div class="form-label">${this.label}</div>`
            : "";
    }

    is_checked(item) {
        if (is_object(item)) return item.value == this.value;
        return item == this.value;
    }

    item_label(item) {
        return is_object(item) ? item.title : item;
    }

    item_value(item) {
        return is_object(item) ? item.value : item;
    }

    render_item(item) {
        let val = item;
        let title = item;
        if (is_object(item)) {
            val = item.value;
            title = item.title;
        }
        return html`
            <div
                class="form-check ${this.options?.direction == "horizontal" ||
                this.horizontal
                    ? "form-check-inline"
                    : ""}"
            >
                <input
                    type="radio"
                    name="radio"
                    class="form-check-input"
                    @change=${this.input_event}
                    ?checked="${this.is_checked(item)}"
                    .value=${val}
                    id="${slugify_simple(val)}"
                    ?required=${this.required}
                />
                <label class="form-check-label" for="${slugify_simple(val)}"
                    >${title}</label
                >
            </div>
        `;
    }
    render() {
        console.log("RADIOS", this.items, this.required);
        let outp = html`${this.render_label()}
            ${this.items
                ? this.items.map((item) => this.render_item(item))
                : this.slotitems}
            ${this.render_feedback()} <slot></slot>`;

        return this.plain ? outp : this.wrap(outp);
    }
}

customElements.define("pi-radios", PiRadios);
