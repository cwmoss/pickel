import Split from "../../vendor/split-grid.js";
import Doclist from "./doclist.js";
import Typelist from "./typelist.js";
import Editor from "./editor.js";
import Arraylist from "./arraylist.js";

import { slugify_simple } from "../lib/util.js";
import urlStore from "../lib/url-store.js";
//import Preview from "./preview.js";
import { edit_node, node, type_node } from "./nodes/index.js";

const tree = new node("root")
tree.children = [
  new type_node("article", "Pages"),
  new edit_node("www.lotsenturm-usedom.de", "Options"),
];

const template = document.createElement("template");
/*

https://github.com/nathancahill/split/tree/master/packages/splitjs

*/
template.innerHTML = /*html*/ `
<style>
:host{
display:block;
height: 100%;
}
.split {
    display: grid;
    grid-template-columns: 200px;
    grid-template-rows:1fr;
    max-height:calc(100vh - 170px);
    height: 100%;
    transition: grid-template-columns 0.2s;
}
.split > *{
max-height:calc(100vh - 170px);
}
.split *{
  box-sizing: border-box;
}
.gutter {
    background-color: #fafafa;
    background-repeat: no-repeat;
    background-position: 50%;
    cursor: col-resize;
    border-left:1px solid #ccc
}


.gutter{
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
    console.log("$$$ panelmanager connected");
    this.addEventListener("panel-collapsed", (e) => this.collapse(e));
    this.addEventListener("panel-expanded", (e) => this.expand(e));
    this.addEventListener("open-preview", (e) => this.open_new(e.detail));
    this.addEventListener("close-panel", (e) => this.close(e.detail));
    this.initialize();
  }

  initialize() {
    // this.add_rootpanel();
    let root = this.make_panel(tree.title, 0, tree);
    this.panels.push(root);

    let saved = urlStore.get_array("z");
    console.log("$$$ path read", saved);
    let current = root;
    let broken = false;
    saved.forEach((id, idx) => {
      console.log("$$$ path step", id, idx, current);
      let next = current.node.find_child(id);
      if (!next || broken) {
        broken = true;
        return
      }
      let panel = this.make_panel(id, idx + 1, next);
      panel.doc_id = id;
      this.panels.push(panel);
      current = panel;
    });
    if (broken) {
      console.log("$$$ path broken, render editor, happens for search results searching");
      let id = saved.slice(-1)[0]
      let panel = this.make_panel(id, null, new edit_node(id, "Edit " + id));
      panel.doc_id = id;
      this.panels.push(panel);
    }
    this.render();

    // set_active funktioniert erst nach dem rendern des panels
    // todo: finde nen besseren weg
    setTimeout(
      () =>
        saved.forEach((id, idx) => {
          this.panels[idx].set_active_init(id);
        }),
      100
    );
  }

  make_panel_element(name) {
    if (name == "Typelist") return new Typelist();
    if (name == "Arraylist") return new Arraylist();
    if (name == "Doclist") return new Doclist();
    return new Editor();
  }

  make_panel(title, index, node) {
    index ??= this.panels.length;
    console.log("$$ make panel", title, index, node);
    let p;
    p = this.make_panel_element(node.element);
    p.node = node
    // p.title = title;
    p.index = index;
    return p
    if (index == 0) {
      // p = new Typelist();
      p = new Arraylist();
      p.node = tree;
    } else if (index == 1) {
      p = new Doclist();
    } else {
      p = new Editor();
    }
    p.title = title;
    p.index = index;
    p.id = slugify_simple(title);

    return p;
  }


  add_panel(title, node) {
    console.log("$$ make panel add", title, node);
    let panel = this.make_panel(title, node);

    this.panels.push(panel);
  }

  close(detail) {
    // this.panels.splice(panel - 1, Infinity);
    let panel = detail.panel;
    this.panels.splice(panel, Infinity);
    console.log("$$$ request close panel", panel, this.panels);
    this.render();
  }

  open_new(preview) {
    console.log("$$ make panel request new panel", preview, preview.panel);
    this.panels[preview.panel].set_active(preview.id);
    let node = this.panels[preview.panel].node
    let newnode = node.find_child(preview.id)

    let panel = this.make_panel(preview.id, preview.panel + 1, newnode);
    panel.doc_id = preview.id;
    panel.doc_create = preview.create ?? null;
    this.panels.splice(preview.panel + 1, Infinity, panel);
    let active = this.panels.map((p) => p.doc_id);
    console.log("$$$ path", active);
    // das root panel brauchen wir nicht
    active.shift();
    urlStore.set_array("z", active);
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
    console.log("$$ make panel render", this.panels);
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
    for (let c of container.children) {
      console.log("$$$ render panels", c == this.panels[0]);
      // Do stuff with child c
    }
    // überschüssige panels löschen
    container
      .querySelectorAll("*:nth-child(n+" + (add.length + 1) + ")")
      .forEach((e) => e.remove());

    let available = Array.from(container.children);
    add.forEach((newp, idx) => {
      if (!available[idx]) {
        console.log("## append", newp);
        container.append(newp);
      } else {
        if (available[idx] != newp) {
          console.log("## replace", newp);
          available[idx].replaceWith(newp);
        }
      }
    });
    //container.replaceChildren();
    //container.append(...add);
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


  make_gutter() {
    let div = document.createElement("div");
    div.classList.add("gutter");
    return div;
  }

}

customElements.define("pi-panel-manager", PanelManager);
