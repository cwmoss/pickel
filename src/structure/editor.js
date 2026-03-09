import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import api from "../lib/api.js";
import schema from "../form-elements/schema.js";
import Panel from "./panel.js";
import ElementManager from "../form-elements/_element_manager.js";
import ObjectContainer from "../form-elements/object-container.js";

export default class Editor extends Panel {
    static properties = {
        // title, doc_id from panels
        ...Panel.properties,
        /* das schema für den document _type */
        schema: { attribute: false },
        id: {},
        /* document _type */
        type: {},
        fullscreen: { type: Boolean },
        document: { type: Object },
        doc_create: { type: Object },
        container: { type: Object, attribute: false },
    };

    _id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    default_width = "1fr";

    async fetch_content() {
        /*
        let formbuilder = new Editor();
          formbuilder.id = this.doc_id;
          content.push(formbuilder);
          // content.textContent = JSON.stringify(doc);
        }
        this.content = content;
        */
        this.id = this.doc_id;
        if (this.doc_create) {
            this.document = this.doc_create;
        } else {
            this.document = await api.document(this.id);
        }
        console.log("$$$$ document loaded", this.id, this.document);
        this.type = this.document._type;
        if (!this.type) return;

        console.log("$$$ load schema", this.type, this._id, this.document);

        this.element_manager = new ElementManager(schema);
        this.schema = schema.get_type(this.type);

        this.container = new ObjectContainer();
        let setup = {
            manager: this.element_manager,
            schema: this.schema,
            prefix: this.document._type,
            level: 0,
            value: this.document,
            editmode: true,
            name: this.document._type,
        };
        this.container.setup = setup;


        console.log("$$$ set_schema in object container", schema);

        this.container.schemaid = this._id;

        //this.container = "";
        return;
    }

    xxxupdated(changedProperties) {
        if (changedProperties.has("type")) {
            this.load_schema();
        }
    }
    inspect() { }
    submit(e) {
        e.preventDefault();
        let data = this.container.get_updated_data();
        console.log("+++ save", data);

        return false;
    }

    go_fullscreen(e) {
        console.log("$ fullscreen", e);
        this.fullscreen = e.detail;
    }
    send_document(e) {
        e.detail.data = this.container.get_updated_data();
    }
    show_json(e) {
        this.document = this.container.get_updated_data();
        this.requestUpdate();
        // this.shadowRoot.querySelector("json-viewer").data = {};
        //this.shadowRoot.querySelector("json-viewer").data = JSON.parse(
        //  JSON.stringify(this.document)
        //);
        // this.shadowRoot.querySelector("json-viewer").requestUpdate();
        // console.log("$ doc", this.document);

        this.shadowRoot.querySelector("#editor-json-view").open_dialog();
    }
    show_backlinks() {
        this.dispatchEvent(
            new CustomEvent("open-detail", {
                detail: { panel: this.index, id: "$backlinks", parent: this.document._id },
                bubbles: 1,
                composed: 1,
            })
        );
    }
    show_revisions() {
        this.dispatchEvent(
            new CustomEvent("open-detail", {
                detail: { panel: this.index, id: "$revisions", parent: this.document._id },
                bubbles: 1,
                composed: 1,
            })
        );
    }
    async save(e) {
        let doc = this.container.get_updated_data();
        console.log("$ save", doc);
        await api.mutate(doc);
        this.document = doc;
    }
    async action(name) {
        console.log("++ action", name);
        let res = await api.action(name, this.container.get_updated_data());
        console.log("++ action result", res);
        if (res.document) {
            this.document = res.document;
            this.container.value = this.document;
        }
    }
    // <button type="button" @click=${this.inspect}>i</button>
    render_actions() {
        if (!this.schema) return "";
        console.log("+++ actions", this.schema.actions);
        return html`<pi-btn primary form="editor" @click=${this.save}>
        Save
      </pi-btn>
      ${this.schema.actions.map((action) => {
            return html`<pi-btn
          form="editor"
          @click=${() => this.action(action.name)}
        >
          ${action.title}
        </pi-btn>`;
        })}
      <pi-btn
        flat
        icon="info"
        title=${"inspect document"}
        @click=${this.show_json}
      ></pi-btn>
      <pi-btn
        flat
        title=${"backlinks"}
        @click=${this.show_backlinks}
      ><wa-icon name="link" label="backlinks"></wa-icon></pi-btn>
      <pi-btn
        flat
        title=${"revisions"}
        @click=${this.show_revisions}
      >R</pi-btn>
      <pi-close @click=${this.close}></pi-close>`;
    }
    /* let json = JSON.stringify(this.document) || "{}";
        // console.log("JSON", json);
        let doc = JSON.parse(json);
        */
    // ${this.container}
    render_content() {
        if (!this.document) return "";
        let json = JSON.stringify(this.document) || "{}";
        let doc = JSON.parse(json);
        console.log("render formbuilder", this.document, this.container);
        return html`<form id="editor" @submit=${this.save}>
      <div ?hidden=${this.fullscreen} class="actions"></div>
      <section
        style="padding:1rem;"
        @get-document=${this.send_document}
        @toggle-fullscreen="${this.go_fullscreen}"
      >
        ${this.container}
      </section>
    </form>
    <pi-dialog
        id="editor-json-view"
        nobutton
        title="inspect"
        .trigger_title=${"i"}
        ><json-viewer
          .data=${doc}
          style="--background-color: white;"
        ></json-viewer
      ></pi-dialog>
    `;
    }

    xxcreateRenderRoot() {
        return this;
    }
}

customElements.define("sh-editor", Editor);
