import { LitElement, css, html, repeat } from "../../vendor/lit-all.min.js";

import { is_empty } from "../lib/util.js";

export default class Container extends LitElement {
    static properties = {
        // schema of this field
        value: { attribute: false, type: Object, noAccessor: true },
        /*
          manager contains the schema object
          schema contains the fieldschema object
        */
        of: { type: Array, noAccessor: true },
        level: { type: Number, reflect: true },
        array: { type: Boolean, reflect: true },
        label: {},
        schemaid: {},
        dialog_button: {},
        dialog_title: {},
        is_image: { type: Boolean },
        prefix: { type: String },

        editmode: { type: Boolean, reflect: true },
        noLabel: { type: Boolean },
        preview: { type: Object },
        options: { type: Object, noAccessor: true },
        edit_item: { type: Object },
        has_image: { type: Boolean },
        defined_state: {
            state: true,
            hasChanged: (oldval, newval) => {
                console.log("$ARR $OBJ defined state", oldval, newval);
                return false;
            },
        },
        /*  uploader: { type: Object },
        asset: { type: Object },
        info: { type: Object },
        */
    };

    _was_build = false;
    _schema;
    _manager;
    _value;
    _of = [];
    _type = "";
    _preview_data = {};
    els = [];
    refs = {};

    static empty_value = {};

    get type() {
        return this.setup.schema.type;
    }
    get supertype() {
        return this.setup.schema.supertype;
    }

    get value() {
        return this._value || this.constructor.empty_value;
    }
    set value(v) {
        console.log("$CONTAINER set value", v);
        this._value = v;
        //        this.init_schema_value();
    }

    _opts = {};
    set options(opts) {
        if (opts) this._opts = opts;
    }
    get options() {
        return this._opts;
    }
    // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object

    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    async validate() {
        let all_true = true;
        for (const el of this.els) {
            console.log("validate-element", el);
            // this.els.forEach(async (el) => {
            if (typeof el["validate"] === "function") {
                console.log("validate-element");
                let ok = await el.validate();
                if (ok !== true) all_true = false;
            }
        }
        return all_true;
    }

    validate_sync() {
        let all_true = true;
        for (const el of this.els) {
            console.log("validate-element", el);
            // this.els.forEach(async (el) => {
            if (typeof el["validate_sync"] === "function") {
                console.log("validate-element");
                let ok = el.validate_sync();
                if (ok !== true) all_true = false;
            }
        }
        return all_true;
    }
    update_value(val) {
        this._value = val;
        this.els.forEach((el) => {
            let name = el.name;
            el.value = val[name];
        });
    }

    get_updated_data() {
        let value = this._value || {};
        this.els.forEach((el) => {
            let val = undefined;
            if (typeof el["get_updated_data"] === "function") val = el.get_updated_data()
            else val = el.value
            console.log(
                "$container-element get updated data",
                el.name,
                el.constructor.name,
                val
            );

            let name = el.name;
            if (is_empty(val)) {
                delete value[name];
            } else {
                value[name] = val;
            }
        });
        console.log("$container get updated data", this.name, value);
        return value;
    }

    init() { }

    get_preview() { }

    new_previewdata(e) {
        e.stopPropagation();
        console.log("++preview DATA", this.name, this.type, this.setup.prefix, e.detail);
        this._preview_data[e.detail.name] = e.detail; // key besser: e.detail.name
        this.preview = this.get_preview("containerUPDATE");
        this.requestUpdate();
    }

    render_actions() {
        return "";
    }

    render_els() {
        return this.els;
    }

    render_preview() {
        return this.get_preview();
    }

    render() {
        // ${this.render_preview()}
        // console.log("render container", this.els);

        let preview = true;

        if (this.editmode !== undefined) {
            preview = !this.editmode;
        } else {
            if (this.level > 3) preview = true;
            else preview = false;
        }

        // if (preview) return this.render_preview();
        return html`<div @preview-data=${this.new_previewdata}>
      ${this.noLabel
                ? ""
                : html`<label title=${this.type}>${this.label}</label>`}
      <div ?hidden=${!preview} class="preview">${this.render_preview()}</div>
      <div ?hidden=${preview} class="edit">
        ${this.dialog_button
                ? html`<pi-dialog
              title=${this.dialog_title ?? "edit"}
              trigger_title=${this.dialog_button}
            >
              <div class="els">${this.render_els()}</div>
            </pi-dialog>`
                : html`
              <div
                @toggle-fullscreen=${(e) => {
                        console.log("$$ fullscreen", e);
                    }}
                class="els"
              >
                ${this.render_els()}
              </div>
              ${this.render_actions()}
            `}
      </div>
    </div>`;
    }

    createRenderRoot() {
        return this;
    }
}

customElements.define("pi-container", Container);
