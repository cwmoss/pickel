import { LitElement, css, html, classMap } from "./../vendor/lit-all.min.js";
import api from "../lib/slow-hand.js";
import Preview from "../components/preview.js";
import FormBuilder from "../components/form-builder.js";

const style = css`
  :host {
    /* --selected-id: "person"; */
  }
  /*
  bullshit
  pi-preview[id="var(--selected-id)"] {
    color: red;
    background-color: var(--color-accent);
  }
    */
  .wrapper {
    min-height: 100vh;
  }
  .panel {
    height: inherit;
    overflow: hidden;
    position: relative;
  }
  .child--content {
    margin: 0px;
    height: calc(100% - 50px);
    overflow-y: auto;
  }
  .panel--head {
    width: 100%;
    cursor: pointer;
    height: 50px;
    border-bottom: 1px solid rgba(134, 144, 160, 0.4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }
  .panel--title {
    font-size: 16px;
    font-weight: bold;
  }
  .panel-collapsed {
    height: 100%;
    width: 100%;
    display: flex;
    cursor: pointer;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .panel--head-collapsed {
    height: 100%;
    width: 100%;
    padding-top: 14px;
    padding-left: 12px;
    writing-mode: vertical-lr;
    text-orientation: mixed;
  }
  .actions {
    display: flex;
    flex-wrap: nowrap;
  }
  .panel-collapsed [not-collabsed] {
    display: none;
  }
  .panel [collabsed] {
    display: none;
  }
  [hidden] {
    display: none;
  }
`;

export default class Panel extends LitElement {
  static properties = {
    title: {},
    collabsed: { type: Boolean },
    init: { type: Boolean },
    content: { type: Array },
  };

  static styles = [style];

  constructor() {
    super();
    this.index = null;
    this.init = false;
    this.collabsed = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    // für jedes panel nur 1x initialisieren
    if (this.init) return;
    console.log("+++ panel connected", this.title);
    this.handle_collapse();
    await this.fetch_content();
    this.init = true;
  }

  async fetch_content() {
    let content = [];
    let schema = await api.current_schema();
    console.log("+panel=>schema", this.index, schema);
    if (this.index == 0) {
      schema.documents.forEach((item) => {
        let el = new Preview();
        el.set_data({ id: item.name, title: item.title }, this.index);
        content.push(el);
      });
    } else if (this.index == 1) {
      let docs = await api.documents(this.title);
      docs.forEach((item) => {
        let el = new Preview();
        el.set_data(item, this.index);
        content.push(el);
      });
    } else {
      let doc = api.document(this.doc_id);
      let formbuilder = new FormBuilder();
      formbuilder.value = "hein@z";
      content.push(formbuilder);
      // content.textContent = JSON.stringify(doc);
    }
    this.content = content;
  }
  set_active(id) {
    let els = this.shadowRoot.querySelectorAll(".child--content > [active]");
    console.log("active elements", id, els);
    els.forEach((el) => {
      if (el.data.id != id) el.removeAttribute("active");
    });
  }
  handle_collapse(e) {
    if (e) {
      this.collabsed = !this.collabsed;
    }
    if (this.collabsed) {
      if (e)
        this.dispatchEvent(
          new CustomEvent("panel-collapsed", {
            detail: { index: this.index },
            bubbles: 1,
            composed: 1,
          })
        );
    } else {
      if (e)
        this.dispatchEvent(
          new CustomEvent("panel-expanded", {
            detail: { index: this.index },
            bubbles: 1,
            composed: 1,
          })
        );
    }
  }

  onPanelHeadClose() {
    // stop
  }
  render_content() {
    return html` ${this.content?.map((item) => item)} `;
  }
  render() {
    console.log("render panel", this);
    return html`<div
      class="wrapper ${classMap({
        panel: !this.collabsed,
        "panel-collapsed": this.collabsed,
      })}"
    >
      <div
        collabsed
        @click=${this.handle_collapse}
        class="panel--head-collapsed ellipsis"
      >
        <span class="panel--title">${this.title}</span>
      </div>
      <div not-collabsed class="panel--head" @click=${this.handle_collapse}>
        <button
          hidden
          icon="o_arrow_back"
          flat
          @click=${this.onPanelClose}
        ></button>
        <span class="panel--title ellipsis">${this.title}</span>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>

      <div not-collabsed class="child--content">${this.render_content()}</div>
    </div> `;
  }
}
