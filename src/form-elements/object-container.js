// import { html } from "../../vendor/lit-core.min.js";
// import { get_component, resolve_components } from "./component-loader.js";

import Container from "./container.js";
import ObjectPreview from "./object-preview.js";


export default class ObjectContainer extends Container {
    static empty_value = {};

    connectedCallback() {
        super.connectedCallback();
        this.value = this.setup.value;
        // console.log("++ connected");
        // his.init();
        this.build();
    }

    update_value(val) {
        this._value = val || ObjectContainer.empty_value;
        this.els.forEach((el) => {
            let name = el._name;
            console.log("$OBJ update", name, val[name]);
            el.value = val[name];
        });
        this.preview = this.get_preview("container");
    }
    init() {
        console.log("$OBJ init", this.type);
    }
    build() {
        //this.editmode = false;
        //if (this._was_build) return;
        //this._was_build = true;
        console.log("$OBJ +++ build ObjectContainer", this.type, this.value, this.setup.schema.fields);
        let fields = this.setup.schema.fields;
        this.els = this.setup.manager.fields_to_els(fields, this.value, this.setup);
        this.preview = this.get_preview("container");
    }

    get_preview(from) {
        // top level document
        console.log(
            "$OBJ $object container get_preview RENDER",
            this.type,
            this.setup.manager.schema.is_document(this.type)
        );
        if (this.setup.manager.schema.is_document(this.type)) return "";
        console.log(
            "$object container get_preview RENDER 01",
            this.type,
            this.setup.manager.schema.is_document(this.type)
        );
        let data = {};
        Object.assign(data, this._value, this._preview_data);
        //console.log("++getpreview", from, this.refs?.person);
        // let title = this.schema?.preview?.title;
        let p = new ObjectPreview();

        p.set_data(data, this.schema, this.setup.manager.schema.get_preview(data));
        return p;
    }

    render_preview() {
        return this.preview;
    }
}

customElements.define("pi-object-container", ObjectContainer);
