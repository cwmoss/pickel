import { html } from "../../vendor/lit-core.min.js";
import Container from "./container.js";
import schema from "../lib/schema.js";
import { get_component, resolve_components } from "./component-loader.js";
import api from "../lib/slow-hand.js";
import MultiUpload from "../upload/multi-upload.js";
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
export default class ArrayContainer extends Container {
  enable_add = true;
  get value() {
    return this._value || [];
  }
  set value(v) {
    if (!v) {
      v = [];
    }
    this._value = v;
  }

  get_types() {
    let types = this.of || [];
    types = types.map((f) => {
      if (schema.is_reference(f.type)) {
        return "reference";
      }
      if (schema.is_object(f.type)) {
        return "object";
      }
      if (schema.is_image(f.type)) {
        return "imageobject";
      }
      return f.type;
    });
    console.log("$ get types for array", this._name, this.of[0].type, types);
    return types;
  }

  after_init() {
    console.log("$$$ array type", this.of[0].type);
    this.has_image = false;
    if (schema.is_image(this.of[0].type)) {
      this.has_image = true;
    }
    /*if (schema.is_ref(this.of[0].type)) {
      this.subtype = this.of[0].type;
      this.of[0].type = "reference";
    }*/
    setTimeout(() => {
      let sortable = LitSortable.create(this.renderRoot.querySelector(".dnd"), {
        delay: 100,
        handle: ".handle",
        onEnd: (e) => this.dropped(e),
      });
    });
  }

  get_preview() {
    this.requestUpdate();
  }

  new_array_item_value(type) {
    switch (type) {
      case "reference":
        return "";
      case "string":
        return "";
      default:
        return {};
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
    let f = this.new_input(
      { type: type, subtype: this.subtype },
      `${this.prefix}[${index}]`,
      val
    );
    f.opts = {
      label: this.name,
      // id: field.name,
    };
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
  rearrange(from, to) {}

  build() {
    this.new_array_item_edit();
    this.editmode = true;
    let type = this.of[0].type;

    this.els = this.value.map((val, index) => {
      let f = this.new_input({ type: type }, `${this.prefix}[${index}]`, val);
      f.opts = {
        label: this.name,
        // id: field.name,
      };
      f.noLabel = true;
      f.editmode = false;
      return f;
    });
  }

  item_new() {
    console.log("$ item new", this.querySelector("pi-dialog.new-item"));
    this.querySelector("pi-dialog.new-item").open();
  }
  item_new_save(e) {
    console.log("$ item new save", e, this.edit_item);
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
            Add Item
          </button>
        </div>`
      : ""}`;
  }

  render_els() {
    console.log("+++ render ArrayContainer", this.els);
    return html`<div class="dnd" @dropped=${this.dropped}>
        ${this.els.map((el, idx) => {
          console.log("els array element", el);
          return html`<div class="array-el">
            <div class="handle"></div>
            <div class="el-content" @click=${() => this.item_edit(el)}>
              ${el}
            </div>
            <div class="el-actions">
              <pi-btn flat @click=${() => this.item_remove(idx, el)}
                ><sl-icon name="x"></sl-icon
              ></pi-btn>
            </div>
          </div> `;
        })}
      </div>
      ${this.els.length == 0
        ? html`<div class="container--empty-array">no entries</div>`
        : ""}

      <pi-dialog nobutton class="new-item" @close=${this.item_new_save}
        >${this.edit_item}</pi-dialog
      > `;
  }

  render_preview() {
    return html`${this.els.map((el, idx) => {
      console.log("preview array element", el);
      return html`<div class="array-el">
        <div class="handle"></div>
        ${el}
      </div> `;
    })}
    ${this.els.length == 0
      ? html`<div class="container--empty-array">no entries</div>`
      : ""} `;
  }
}

customElements.define("pi-arraycontainer", ArrayContainer);
