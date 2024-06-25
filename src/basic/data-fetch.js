import { LitElement, css, html } from "../../vendor/lit-core.min.js";

import api from "../../lib/slow-hand.js";
import { resolve_path } from "../../lib/util.js";

class DataFetch extends LitElement {
  static properties = {
    url: {},
    api: {},
    data: { type: Object },
  };

  static styles = css`
    :host {
      display: contents;
    }
  `;
  async connectedCallback() {
    super.connectedCallback();
    this.data = await this.fetch_data();
    this.handleSlotchange();
  }

  async fetch_data() {
    let res, data;
    if (this.api) {
      console.log("fetching API", this.api);
      data = await api[this.api]();
    } else if (this.query) {
      data = await api.query(this.query);
    } else {
      console.log("fetching", this.url);
      res = await fetch(this.url, { method: "GET", credentials: "include" });
      data = await res.json();
    }

    return data;
  }

  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector("slot");
    return slot.assignedElements({
      flatten: true,
    });
  }
  update_element_data(el) {
    if (el.hasAttribute("input-key")) {
      let key = el.getAttribute("input-key");
      let prop = el.getAttribute("input-prop") || "data";
      console.log(
        "+++ input key",
        key,
        this.data,
        resolve_path(this.data, key)
      );
      el[prop] = resolve_path(this.data, key);
    }
  }
  handleSlotchange() {
    console.log("slot change", this.shadowRoot.querySelectorAll("slot"));
    this._slottedChildren.forEach((el) => {
      console.log("+slotted+++", el, el.querySelectorAll("*"));
      el.querySelectorAll("*").forEach((el) => this.update_element_data(el));
      this.update_element_data(el);
    });
  }
  async dofetch() {
    await this.timeout(1000);
    return ["harry", "ewald", "Mimmi"];
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  render() {
    let data = false;
    if (this.data) data = true;
    return html`<slot @slotchange=${this.handleSlotchange}
      ><json-viewer
        input-key=""
        style="--background-color: white;"
      ></json-viewer
    ></slot>`;
  }
}
customElements.define("pi-data-fetch", DataFetch);
