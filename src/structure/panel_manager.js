import Split from "../vendor/split.js";
import Panel from "./panel.js";

//import Preview from "./preview.js";

import api from "../lib/slow-hand.js";
const template = document.createElement("template");
/*

https://github.com/nathancahill/split/tree/master/packages/splitjs

*/
template.innerHTML = /*html*/ `
<style>
.split {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}
.split *{
  box-sizing: border-box;
}
.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
    flex-shrink: 0;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>


<div class="panels split"></div>

`;

export default class PanelManager extends HTMLElement {
  constructor() {
    super()
      .attachShadow({ mode: "open" })
      .appendChild(template.content.cloneNode(true));
    this.panels = [];
    this.splitter = null;
  }
  connectedCallback() {
    this.addEventListener("panel-collapsed", (e) => this.collapse(e));
    this.addEventListener("panel-expanded", (e) => this.expand(e));
    this.addEventListener("open-preview", (e) => this.open_new(e.detail));
    this.add_panel("docs");
    // this.add_panel("editor");
    this.render();
    window.setTimeout(() => {
      // this.add_panel("preview");
      // this.render();
    }, 3000);
  }
  open_new(preview) {
    console.log("request new panel", preview, preview.panel);
    this.panels[preview.panel].set_active(preview.id);
    let panel = this.make_panel(preview.id, preview.panel + 1);
    panel.doc_id = preview.id;
    this.panels.splice(preview.panel + 1, Infinity, panel);
    this.render();
  }
  collapse(e) {
    let sizes = this.splitter.getSizes();
    console.log("panel collapsed", e, sizes);
    this.splitter.collapse(e.detail.index);
    //sizes[e.detail.index] = "10"; // "200px";
    //this.splitter.setSizes(sizes);
  }
  expand(e) {
    console.log("panel expand", e);
    let sizes = this.splitter.getSizes();
    console.log("panel expand", sizes);
    sizes[e.detail.index] = 50; // "200px";
    this.splitter.setSizes(sizes);
  }
  render() {
    let container = this.shadowRoot.querySelector(".panels");
    container.replaceChildren();
    container.append(...this.panels);
    if (this.splitter) {
      this.splitter.destroy(true, true);
    }
    this.splitter = Split(this.panels, {
      minSize: 30,
    });
  }
  add_panel(title) {
    let panel = this.make_panel(title);

    this.panels.push(panel);
  }
  make_panel(title, index) {
    let p = new Panel();
    p.setAttribute("title", title);
    p.index = index ?? this.panels.length;
    return p;

    let div = document.createElement("div");
    div.appendChild(p);
    return div;
  }
}
