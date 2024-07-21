import { LitElement, css, html } from "../../vendor/lit-core.min.js";
import ArrayContainer from "../form-elements/array-container.js";
import api from "../lib/slow-hand.js";

export default class CustomRwGallery extends ArrayContainer {
  static properties = {
    value: { type: Object },
    pad_edit: { type: Object },
  };

  static styles = [
    // cssvars,
    css`
      :host {
      }
      span {
      }
      .array-el {
        display: inline-grid;
        width: 130px;
        height: 130px;
        border: 1px solid #d9d9d9;
        padding: 3px;
        margin-right: 12px;
        margin-bottom: 6px;
        background-color: #f0f0f0;
      }
      .array-el > * {
        grid-area: 1 / 1;
        min-width: 0;
      }
      .array-el img {
        width: 130px;
        height: 130px;
        object-fit: contain;
        // better drag-n-drop
        pointer-events: none;
      }
      .dbl {
        /* float:left; */
        margin-right: 0px;
        margin-left: 12px;
        border-right: 1px solid #f0f0f0;
      }
      .dbl img {
        object-position: 90% 50%;
      }
      .dbl + div {
        margin-right: 12px;
        border-left: 1px solid #f0f0f0;
        /* margin-left: 126px; */
      }
      .dbl + div img {
        object-position: 10% 50%;
      }
      .array-el .props {
        background: white;
        height: fit-content;
        padding: 3px;
        display: none;
      }
      .array-el .number {
        color: #999;
      }
      .array-el:hover .props {
        display: block;
      }
      .props em {
        cursor: pointer;
        font-style: normal;
      }
      img {
        // outline: 3px solid green;
      }
      .handle {
        background: transparent;
      }
    `,
  ];
  enable_add = false;
  toggle_dbl(item, idx) {
    if (item.double) item.double = false;
    else item.double = true;
    this.requestUpdate();
  }

  toggle_pad_edit(item, idx, e) {
    console.log("toggle pad", e, item);
    if (this.pad_edit) {
      this.value[idx].padding = e.detail;
      this.pad_edit = null;
    } else this.pad_edit = item;
  }
  get_updated_data() {
    return this.value;
  }
  render_els() {
    console.log("+++ render RW ArrayContainer", this.els);
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

  createRenderRoot() {
    return LitElement.prototype.createRenderRoot.call(this);
    // return this.attachShadow({ mode: "open" });
  }
}

window.customElements.define("custom-rwgallery", CustomRwGallery);
