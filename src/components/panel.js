import Api from "../lib/api.js";
import Preview from "./preview.js";
import FormBuilder from "./form-builder.js";

const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
  .wrapper{
    min-height:100vh;
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
.panel-collapsed [not-collabsed]{
  display:none;
}
.panel [collabsed]{
  display:none;
}
[hidden]{
  display:none;
}
</style>
<div class="wrapper">
<div
  collabsed
  v-show="collapsedView"
  @click.stop="onPanelHeadClick"
  class="panel--head-collapsed ellipsis"
>
  <span class="panel--title">{{ title }}</span>
</div>
<div
  not-collabsed
  class="panel--head"
  @click.stop="onPanelHeadClick"
>
  <button hidden
    v-if="mobile && !first"
    icon="o_arrow_back"
    flat
    @click.stop="onPanelClose"
  ></button>
  <span class="panel--title ellipsis">{{ title }}</span>
  <div class="actions">
    <slot name="actions"></slot>
  </div>
</div>

<div not-collabsed class="child--content">
</div>
</div>
`;

export default class Panel extends HTMLElement {
  constructor() {
    super()
      .attachShadow({ mode: "open" })
      .appendChild(template.content.cloneNode(true));
    this.index = null;
    this.init = false;
  }

  async connectedCallback() {
    // für jedes panel nur 1x initialisieren
    if (this.init) return;
    this.title = this.getAttribute("title");
    this.collabsed = this.getAttribute("collabsed");
    console.log("+++ panel connected", this.title);
    this.shadowRoot
      .querySelectorAll(".panel--title")
      .forEach((el) => (el.innerHTML = this.title));
    this.shadowRoot
      .querySelectorAll(".panel--title")
      .forEach((el) =>
        el.addEventListener("click", () => this.handle_collapse(true))
      );
    this.handle_collapse();
    await this.fetch_content();
    this.init = true;
  }

  async fetch_content() {
    let content = this.shadowRoot.querySelector(".child--content");
    if (this.title == "docs") {
      Api.get_types().forEach((item) => {
        let el = new Preview();
        el.set_data({ id: item, title: item }, this.index);
        content.appendChild(el);
      });
    } else if (this.title == "author" || this.title == "doc") {
      Api.get_all(this.title).forEach((item) => {
        let el = new Preview();
        el.set_data({ id: item.id, title: item.title }, this.index);
        content.appendChild(el);
      });
    } else {
      let doc = Api.get_doc(this.doc_id);
      let formbuilder = new FormBuilder();
      formbuilder.value = "hein@z";
      content.appendChild(formbuilder);
      // content.textContent = JSON.stringify(doc);
    }
  }
  set_active(id) {
    let els = this.shadowRoot.querySelectorAll(".child--content > [active]");
    console.log("active elements", id, els);
    els.forEach((el) => {
      if (el.data.id != id) el.removeAttribute("active");
    });
  }
  handle_collapse(toggle) {
    if (toggle) {
      this.collabsed = !this.collabsed;
    }
    let wrapper = this.shadowRoot.querySelector(".wrapper");
    if (this.collabsed) {
      wrapper.classList.remove("panel");
      wrapper.classList.add("panel-collapsed");
      if (toggle)
        this.dispatchEvent(
          new CustomEvent("panel-collapsed", {
            detail: { index: this.index },
            bubbles: 1,
            composed: 1,
          })
        );
    } else {
      wrapper.classList.add("panel");
      wrapper.classList.remove("panel-collapsed");
      if (toggle)
        this.dispatchEvent(
          new CustomEvent("panel-expanded", {
            detail: { index: this.index },
            bubbles: 1,
            composed: 1,
          })
        );
    }
  }
}

/*
this.shadowRoot.querySelector("[collabsed]").removeAttribute("hidden");
      this.shadowRoot
        .querySelector("[not-collabsed]")
        .setAttribute("hidden", "");

        this.shadowRoot
        .querySelector("[not-collabsed]")
        .removeAttribute("hidden");
      this.shadowRoot.querySelector("[collabsed]").setAttribute("hidden", "");
      */
