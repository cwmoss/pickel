import { html, repeat, render, unsafeHTML } from "../../vendor/lit-all.min.js";
import Container from "./container.js";
import { get_component_tag, resolve_components } from "./component-loader.js";
import api from "../lib/api.js";
import { hashID } from "../lib/util.js";
// import MultiUpload from "../upload/multi-upload.js";
// import Sortable from "../../vendor/sortable.complete.esm.js";
import { LitSortable } from "../../vendor/lit-sortable.js";

let draghandle_image = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  height="24"
  viewBox="0 0 24 24"
  width="16"
>
  <path d="M0 0h24v24H0z" fill="none" />
  <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
</svg>`;
/*
https://github.com/SortableJS/Sortable?tab=readme-ov-file
*/
export default class ArrayContainer extends HTMLElement {
    static properties = {
        //       ...Container.properties,
        edit_item: { type: Object },
    };

    enable_add = true;

    static empty_value = [];
    els = [];

    additional_components() {
        if (this.setup.manager.schema.is_image(this.of[0].type)) {
            //  this.has_image = true;
            return ["multiimageupload"];
        }
        return [];
    }

    connectedCallback() {
        // super.connectedCallback();
        // console.log("++ connected");
        // his.init();
        this.value = this.setup.value;
        this.init_schema_value();
    }

    init_schema_value() {
        console.log(
            "$$$ $IMG init 0 container schema/value",
            this.constructor,
            this.setup,
            this._schema,
            this._value
        );
        this.init();
        this.build();
        this.run_render();
        // this.update_value(this._value);
    }

    run_render() {
        render(this.render(), this);
        let zone = this.querySelector(".dnd");
        console.log("#### elements zone", zone);
        this.render_els(zone);
    }
    get of() {
        return this.setup.schema.of;
    }
    get sortable() {
        return false;
    }
    init() {
        console.log("$ARR init array type", this.setup.schema, this.of);
        // console.log(this.of[0].type);
        this.has_image = false;
        if (this.setup.manager.schema.is_image(this.of[0].type)) {
            this.has_image = true;
        }
        /*if (schema.is_ref(this.of[0].type)) {
          this.subtype = this.of[0].type;
          this.of[0].type = "reference";
        }*/
    }

    firstUpdated() {
        console.log(
            "$ARR first update",
            this.options,
            //  this.renderRoot.querySelector(".dnd")
        );
        if (this.sortable !== false) {
            setTimeout(() => {
                let presortPrevious = [];
                let before;

                let sortable = LitSortable.create(

                    this.renderRoot.querySelector(".dnd"),
                    {
                        delay: 100,
                        handle: ".handle",
                        // onEnd: (e) => this.dropped(e),
                        onStart: e => {
                            // used to put the items back in their pre-sort position onEnd
                            console.log("$$$$ +++ dropped START", this.value);
                            before = e.item.previousSibling;
                            // presortPrevious = e.items.map(item => item.previousSibling)
                        },
                        onEnd: (e) => {
                            before.after(e.item);
                            this.els.splice(e.newIndex, 0, this.els.splice(e.oldIndex, 1)[0]);

                            this.dropped(e)
                            this.requestUpdate();
                            return;


                            const { items, newIndicies, oldIndicies } = e
                            console.log("$$$$ +++ dropped", this.value);
                            // RETURN ELEMENTS TO PREVIOUS POSITIONS, 'CANCELLING' THE SORT
                            presortPrevious.forEach((previous, i) => previous.after(items[i]))

                            // ALLOW LIT TO UPDATE THE DOM BY MOVING ITEMS IN ARRAY
                            // IMPORTANT: NEED TO REMOVE ALL ITEMS FROM ARRAY AND ADD THEM BACK AS A 2nd STEP
                            const movedArrayItems = oldIndicies.map(({ index }) => this.els[index])

                            // 1. REMOVE MOVED ITEMS
                            const indiciesToRemove = oldIndicies.map(({ index }) => index)
                            const myFilteredArray = this.els.filter((item, i) => !indiciesToRemove.includes(i))

                            // 2. ADD THEM ALL BACK IN
                            newIndicies.forEach(({ index }, i) => myFilteredArray.splice(index, 0, movedArrayItems[i]))
                            this.els = myFilteredArray

                            this.dropped(e);
                        }
                    },
                    // this, "els"
                );
            });
        }
    }

    get_preview() {
        this.requestUpdate();
    }

    // TODO: alle varianten
    new_array_item_value(type) {
        switch (type) {
            case "reference":
                return "";
            case "string":
                return "";
            default:
                return { _type: type, _key: hashID(8) };
        }
    }

    new_array_item(e) {
        //console.log("new click", e);
        //e.preventDefault();
        //e.stopImmediatePropagation();
        // this.value.push({}); //(this.value || []).concat([{}]);
        //console.log("+++ new array", this.value);
        // this.build_array();
        let type = this.of[0].type;
        let index = this.els.length;
        let val = this.new_array_item_value(type);
        /*if (!this.value) {
          this.value = [val];
        } else {
          this.value.push(val);
        }
    */
        let f = this.setup.manager.make_new_input(
            { type: type, subtype: this.subtype },
            `${this.prefix}[${index}]`,
            val
        );

        //this
        console.log("$$ new array item", f);
        return f;
    }

    new_array_item_edit(e) {
        let item = this.new_array_item(e);
        // this.els.push(f);
        this.edit_item = item;
        // this.requestUpdate();
        console.log(this.querySelector("pi-dialog"));
        // setTimeout(() => this.querySelector("pi-dialog").open(), 100);
    }
    /*
    https://www.geeksforgeeks.org/how-to-move-an-array-element-from-one-array-position-to-another-in-javascript/
    */
    dropped(e) {
        console.log(
            "$$$$ +++ dropped old=>new",
            e.oldIndex,
            e.newIndex
            // this.querySelectorAll(".els > *")
        );
        // this.get_updated_data()
        let newval = this.els.map(e => e.value)
        // this.value = newval
        console.log("$$$$ +++ new value", this.els, this.value);
        this.requestUpdate();
        return;

        [this.value[e.oldIndex], this.value[e.newIndex]] = [
            this.value[e.newIndex],
            this.value[e.oldIndex],
        ];
        console.log("++ new value", this.value);
        this.build();
        /* [this.els[e.oldIndex], this.els[e.newIndex]] = [
          this.els[e.newIndex],
          els[e.oldIndex],
        ];*/
        this.requestUpdate();
    }
    rearrange(from, to) { }

    get_updated_data() {
        console.log("$array get updated data");
        let newval = this.els.map(e => e.value)
        return newval
        return super.get_updated_data();
    }
    build() {
        let multiupload = get_component_tag("multiimageupload");
        this.new_array_item_edit();
        this.editmode = true;
        let type = this.of[0].type;
        console.log("$ARR", this._name, this.value);
        this.build_elements();
    }
    build_elements() {
        let type = this.of[0].type;
        this.els = this.value.map((val, index) => {
            let f = this.setup.manager.make_new_input({ type: type }, `${this.prefix}[${index}]`, val, this.setup.level);

            f.noLabel = true;
            f.editmode = false;
            return f;
        });
    }
    item_new() {
        console.log("$ item new", this.querySelector("pi-dialog.new-item"));
        this.querySelector("pi-dialog.new-item").open_dialog();
    }
    item_new_save(e) {
        console.log("$array item new save", e, this.edit_item.get_updated_data());
        this.value.push(this.edit_item.get_updated_data());
        this.build();
    }
    item_new_cancel(e) {
        console.log("$array item new cancel", e, this.edit_item);
    }
    item_remove(idx) {
        console.log("item-remove", idx);
        this.value.splice(idx, 1);
        this.els.splice(idx, 1);
        this.requestUpdate();
    }
    item_edit(item) {
        item.editmode = true;
    }
    uploaded_ok(e) {
        //let item = this.new_array_item();
        let asset = e.detail;
        let item = { asset: { type: "reference", _ref: asset._id } };
        this.value.push(item);
        console.log("$$$ new upload", asset, item, this.value);
        this.build();
        this.requestUpdate();
    }

    render() {
        // ${this.render_preview()}
        console.log("render ARRAY container", this.els);

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
        
              <div
                @toggle-fullscreen=${(e) => {
                console.log("$$ fullscreen", e);
            }}
                class="els"
              >
                ${this.render_els_zone()}
                ${this.render_new_dialog()}
              </div>
              ${this.render_actions()}
            
      </div>
    </div>`;
    }

    render_actions() {
        let uploader = "";
        console.log("$$$ upl url", api.upload_image_url());
        if (this.has_image) {
            uploader = html`<multi-upload
        .upload_url=${api.upload_image_url()}
        @image-uploaded=${this.uploaded_ok}
      ></multi-upload>`;
        }
        return html`${uploader}
    ${this.enable_add
                ? html` <div class="container--actions">
          <button type="button" @click=${this.item_new} part="button">
            Add Item ${this.sortable}
          </button>
        </div>`
                : ""}`;
    }

    render_els_zone() {
        return html`<div class="dnd" @dropped=${this.dropped}></div>
        ${this.els.length == 0
                ? html`<div class="container--empty-array">no entries</div>`
                : ""}
        `
    }
    render_els(root) {
        console.log("$ARR render ArrayContainer", this.els, this.options);
        //  @click=${() => this.item_edit(el)}
        // @click=${() => this.item_remove(idx, el)}
        let tpl = document.createElement("template");
        tpl.innerHTML = `<div class="array-el">
            ${this.sortable !== false
                ? `<div class="handle"></div>`
                : ""}
            <div class="el-content"></div>
            <div class="el-actions">
              <pi-btn
                title="remove"
                flat
                ><sl-icon name="trash" label="remove"></sl-icon
              ></pi-btn>
            </div>
          </div>`;

        this.els.forEach(el => {
            let dom = tpl.content.cloneNode(true);
            // console.log("el-node", dom);
            dom.querySelector(".el-content").appendChild(el);
            root.appendChild(dom);
        })
        console.log("result-html", html);
    }

    render_new_dialog() {
        return html`
            <pi-dialog nobutton class="new-item" @close=${this.item_new_save}
        > ${this.edit_item}
        <pi-btn close primary @click=${this.item_new_save}> Save</pi-btn>
            <pi-btn close @click=${this.item_new_cancel}> Cancel</pi-btn>
      </pi-dialog>`;
    }

    render_preview() {
        return html`${this.els.map((el, idx) => {
            console.log("preview array element", el);
            return html`<div class="array-el">
        <div class="handle"></div>
        ${el}
      </div> `;
        })
            }
    ${this.els.length == 0
                ? html`<div class="container--empty-array">no entries</div>`
                : ""
            } `;
    }
}

customElements.define("pi-array-container", ArrayContainer);
