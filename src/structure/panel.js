import { LitElement, css, html, classMap } from "./../vendor/lit-all.min.js";
import api from "../lib/slow-hand.js";
import Preview from "../components/preview.js";

const style = css`
  :host {
    /* --selected-id: "person"; */
  }
  * {
    box-sizing: border-box;
  }
  form-builder {
    padding: 1rem;
    display: block;
  }
  button,
  *::part(button) {
    border-radius: 5px;
    border: 2px solid black;
    box-sizing: border-box;
    background-color: white;
    text-decoration: none;
    text-align: center;

    /* font-family: Helvetica;
  padding: 0.375em 0.5em 0.1875em;
  */
    padding: 0.375em 0.5em 0.4em;
    height: fit-content;
    font-weight: 600;
    line-height: 1;
  }

  button[primary],
  *::part(btn-primary) {
    background: var(--color-accent);
  }

  .wrapper {
    /* min-height: 100vh;*/
  }
  .panel {
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .child--content {
    padding-bottom: 2rem;
    margin: 0px;
    height: calc(100% - 100px);
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
    padding-top: 17px;
    padding-left: 4px;
    writing-mode: vertical-lr;
    text-orientation: mixed;
  }
  .actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 1rem;
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
  sh-editor {
    display: block;
    margin: 0 1rem;
  }
  .els > * {
    margin-bottom: 1rem;
  }
`;

export default class Panel extends LitElement {
  static properties = {
    title: {},
    collabsed: { type: Boolean },
    init: { type: Boolean },
    doc_id: {},
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
    this.init = true;
    console.log("+++ panel connected", this.title);
    this.handle_collapse();
    await this.fetch_content();
  }

  async xxxfetch_content() {
    let content = [];
    let schema = await api.current_schema();
    console.log("+panel=>schema", this.index, schema);
    if (this.index == 0) {
      schema.documents.forEach((item) => {
        let el = new Preview();
        el.set_data({ id: item.name, title: item.title });
        el.simple = true;
        el.icon = "folder";
        content.push(el);
      });
    } else if (this.index == 1) {
      let docs = await api.documents(this.title);
      docs.forEach((item) => {
        let el = new Preview();
        el.set_data(item);
        el.icon = "file-earmark";
        content.push(el);
      });
    } else {
      let formbuilder = new Editor();
      formbuilder.id = this.doc_id;
      content.push(formbuilder);
      // content.textContent = JSON.stringify(doc);
    }
    this.content = content;
  }
  // TODO: refactor
  // kann schon beim ersten rendern gemacht werden
  set_active_init(id) {
    this.shadowRoot.getElementById(id)?.setAttribute("active", "");
    console.log("active INIT", id, this.doc_id);
  }
  set_active(id) {
    let els = this.shadowRoot.querySelectorAll(".child--content > [active]");
    console.log("active elements", id, els);
    els.forEach((el) => {
      if (el.data.id != id) el.removeAttribute("active");
    });
  }
  open_preview(e) {
    e.detail.panel = this.index;
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

  render_actions() {
    return "";
  }

  render_content() {
    return html` ${this.content?.map((item) => item)} `;
  }

  render() {
    console.log("render panel", this);
    return html`
      <div
        class="wrapper ${classMap({
          panel: !this.collabsed,
          "panel-collapsed": this.collabsed,
        })}"
      >
        <div collabsed class="panel--head-collapsed ellipsis">
          <span @click=${this.handle_collapse} class="panel--title"
            >${this.title}</span
          >
        </div>
        <div not-collabsed class="panel--head">
          <span @click=${this.handle_collapse} class="panel--title ellipsis"
            >${this.title}</span
          >
          <div class="actions">${this.render_actions()}</div>
        </div>

        <div
          not-collabsed
          @open-preview=${this.open_preview}
          class="child--content"
        >
          ${this.render_content()}
        </div>
      </div>
    `;
  }
}
