import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import ArrayContainer from "../form-elements/array-container.js";
import api from "../lib/api.js";

export default class TrackingRecords extends ArrayContainer {
  static properties = {
    // value: { type: Object },
  };

  static styles = [];

  //get_updated_data() {
  //  return this.value;
  //}

  item_new_save(e) {
    console.log(
      "$array item new save TRACKING",
      e,
      this.edit_item.get_updated_data()
    );
    this.value.push(this.edit_item.get_updated_data());
    this.value = this.value.sort((a, b) => {
      if (a.date == b.date) return 0;
      if (!a.date) return -1;
      if (!b.date) return -1;
      return a.date > b.date ? -1 : 1;
    });
    console.log("sorted records", this.value);
    this.build();
  }

  xxrender_els() {
    console.log("+++ render tracking ArrayContainer", this.els);
    return html`<div class="dnd" @dropped=${this.dropped}>
        ${this.value.map((item, idx) => {
          console.log("els array element", item);
          return html`<div class="array-el ${item.double ? "dbl" : ""}">
            <div class="el-content" @click=${() => this.item_edit(item)}>
              <img
                src="${api.imageurl_from_ref(item.asset)}"
                alt="${item.asset._ref}"
                width="120"
              />
            </div>
            <div class="handle"></div>
            <div class="el-actions props">
              <em @click=${() => this.toggle_dbl(item, idx)} class="dbl-toggle"
                >dbl</em
              >
              <em
                @click=${() => this.toggle_pad_edit(item, idx)}
                class="dbl-toggle"
                >${item.padding ? item.padding : "--"}</em
              >
              <pi-btn flat @click=${() => this.item_remove(idx, item)}
                >X</pi-btn
              >
            </div>
            ${this.pad_edit && this.pad_edit == item
              ? html`<div class="pad-edit-box">
                  <pi-select
                    noLabel
                    .value=${item.padding}
                    @pi-input=${(e) => this.toggle_pad_edit(item, idx, e)}
                    class="pad-select"
                    items="select padding,pd1,pd2,pd3,pd4,pd5,pd6,pd7,pd8,pd9"
                  ></pi-select>
                </div>`
              : ""}
          </div> `;
        })}
      </div>
      ${this.els.length == 0
        ? html`<div class="container--empty-array">no entries</div>`
        : ""} `;
  }

  xcreateRenderRoot() {
    return LitElement.prototype.createRenderRoot.call(this);
    // return this.attachShadow({ mode: "open" });
  }
}

window.customElements.define("custom-tracking-records", TrackingRecords);
