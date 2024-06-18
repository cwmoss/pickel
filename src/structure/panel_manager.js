import Split from "../vendor/split-grid.js";
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
    display: grid;
    grid-template-columns: 200px;
    grid-template-rows:1fr;
    max-height:calc(100vh - 170px);
    transition: grid-template-columns 0.2s;
}
.split > *{
max-height:calc(100vh - 170px);
}
.split *{
  box-sizing: border-box;
}
.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
    cursor: col-resize;

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
    this.container = this.shadowRoot.querySelector(".panels");
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
    this.adjust_panel_width(e.detail.index, "30px");
  }
  expand(e) {
    this.adjust_panel_width(e.detail.index);
  }

  adjust_panel_width(panelindex, size) {
    let sizes = this.container.style["grid-template-columns"].split(" ");
    let idx = panelindex * 2;
    if (!size) size = this.default_panel_width(panelindex);
    sizes[idx] = size;
    this.container.style["grid-template-columns"] = sizes.join(" ");
  }
  default_panel_width(idx) {
    if (idx == 0) return "200px";
    if (idx == this.panels.length - 1)
      return "" + this.container.clientWidth / 2 + "px";
    return "300px";
  }
  render() {
    let container = this.container;
    let add = [];
    let cols = [];
    let last = this.panels.length - 1;
    this.panels.forEach((p, idx) => {
      add.push(p);
      cols.push(this.default_panel_width(idx));
      if (idx < last) {
        add.push(this.make_gutter());
        cols.push("10px");
      }
    });
    // this.style.setProperty("--split-cols", cols.join(" "));
    container.style["grid-template-columns"] = cols.join(" ");
    // TODO: don't throw away the good panels
    container.replaceChildren();
    container.append(...add);
    // TODO: don't throw away the good panels
    if (this.splitter) {
    }
    this.splitter = Split({
      minSize: 30,
      columnGutters: Array.from(Array(last), (_, i) => {
        let track = i * 2 + 1;
        let el = container.querySelector(":nth-child(" + (track + 1) + ")");
        return { track: track, element: el };
      }),
      onDrag: (direction, track, style) => {
        let prev = this.panels[(track - 1) / 2];
        let next = this.panels[(track - 1) / 2 + 1];
        console.log(
          "+++ dragging",
          direction,
          track,
          prev.collabsed,
          prev.clientWidth,
          style
        );

        if (!prev.collabsed && prev.clientWidth <= 60) {
          prev.handle_collapse({});
          //this.collapse(prev.index);
        }
        if (prev.collabsed && prev.clientWidth > 60) {
          prev.handle_collapse({});
          //this.expand(prev.index);
        }
        if (!next.collabsed && next.clientWidth <= 60) {
          next.handle_collapse({});
          //this.collapse(prev.index);
        }
        if (next.collabsed && next.clientWidth > 60) {
          next.handle_collapse({});
          //this.expand(prev.index);
        }
      },
    });
    console.log(
      "splitter+++",
      this.splitter,
      container.style["grid-template-columns"]
    );
  }

  add_panel(title) {
    let panel = this.make_panel(title);

    this.panels.push(panel);
  }
  make_gutter() {
    let div = document.createElement("div");
    div.classList.add("gutter");
    return div;
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
