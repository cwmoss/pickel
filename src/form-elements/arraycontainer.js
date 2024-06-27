import { html } from "../../vendor/lit-core.min.js";
import Container from "./container.js";
import schema from "../lib/schema.js";
import { get_component, resolve_components } from "./component-loader.js";
import api from "../lib/slow-hand.js";

import Dialog from "./dialog.js";
import Sortable from "../../vendor/sortable.complete.esm.js";
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
  get_types() {
    return [this.of[0].type];
  }

  after_init() {
    setTimeout(() => {
      return;
      let sortable = Sortable.create(this.querySelector(".els"), {
        delay: 100,
        handle: ".handle",
        onEnd: (e) => this.dropped(e),
      });
    });
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
    e.preventDefault();
    e.stopImmediatePropagation();
    // this.value.push({}); //(this.value || []).concat([{}]);
    //console.log("+++ new array", this.value);
    // this.build_array();
    let type = this.of[0].type;
    let index = this.els.length;
    let val = this.new_array_item_value(type);
    if (!this.value) {
      this.value = [val];
    } else {
      this.value.push(val);
    }

    let f = this.new_input({ type: type }, `${this.prefix}[${index}]`, val);
    f.opts = {
      label: this.name,
      // id: field.name,
    };
    //this
    this.els.push(f);
    this.requestUpdate();
  }
  dropped(e) {
    console.log(
      "+++ dropped old=>new",
      e.oldIndex,
      e.newIndex,
      this.querySelectorAll(".els > *")
    );
  }
  rearrange(from, to) {}

  build() {
    this.editmode = true;
    let type = this.of[0].type;

    this.els = (this.value || []).map((val, index) => {
      let f = this.new_input({ type: type }, `${this.prefix}[${index}]`, val);
      f.opts = {
        label: this.name,
        // id: field.name,
      };
      f.noLabel = true;
      return f;
    });
  }

  render_actions() {
    return html`<div class="container--actions">
      <button
        type="button"
        @click=${(e) => this.new_array_item(e)}
        part="button"
      >
        add
      </button>
    </div>`;
  }

  render_els() {
    return html`${this.els.map((el) => {
      console.log("els array element", el);
      return html`<div class="array-el">
        <div class="handle"></div>
        <div class="el-content">${el}</div>
      </div> `;
    })}
    ${this.els.length == 0
      ? html`<div class="container--empty-array">no entries</div>`
      : ""} `;
  }

  render_preview() {
    return html`${this.els.map((el) => {
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
