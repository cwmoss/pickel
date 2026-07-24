import { LitElement, css, html, nothing } from "lit";
import Base from "./base.js";
// import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../util.js";

export default class PiSlug extends Base {
    static properties = { ...Base.properties, prefix: {}, suffix: {} };

    get from() {
        let doc = get_document(this);
        let field = doc.title ? "title" : doc.name ? "name" : "";
        console.log("++ from field", field);
        if (field) return field;
        return false;
    }
    get from_text() {
        let doc = get_document(this);
        return doc[this.from];
    }

    get_default_value() {
        return { current: "" };
    }

    async generate() {
        console.log("generate SLUG");
        return;
        let doc = get_document(this);
        console.log("generate ", doc, this.from_text);
        let slug = slugify(this.from_text);
        let ok = await api.checkSlug(slug, doc._type, doc._id);
        if (!ok) slug += "-" + hashID(5);
        console.log("generate RESULT ", slug);
        this.value = { current: slug };
        this.requestUpdate();
    }
    update_input(e) {
        console.log("+++ update", hashID(5), e, e.target.value);
        this.value.current = e.target.value;
    }
    render() {
        console.log("render §§§ slug §§§ pi-input", this.value, this.setup);
        return html`${this.render_label()}
            <div class="input-group">
                <input
                    type="text"
                    id="input"
                    name=${this.name}
                    value=${this._first_rendered ? nothing : (this.value ?? "")}
                    .value=${!this._first_rendered
                        ? nothing
                        : (this.value ?? "")}
                    @input=${this.input_event}
                    ?required=${this.required}
                    maxlength=${this.maxlength || nothing}
                /><button>Generate</button>
            </div>
            ${this.render_feedback()}
            <slot></slot>`;
    }
}

customElements.define("pi-slug", PiSlug);
