import Split from "../../vendor/split-grid.js";
import Doclist from "./doclist.js";
import Typelist from "./typelist.js";
import Editor from "./editor.js";
import Arraylist from "./arraylist.js";
import Backlinkslist from "./backlinks.js";
import RevisionsPanel from "./revisions-panel.js";
import project from "../lib/project.js";

import { slugify_simple } from "../lib/util.js";
import urlStore from "../lib/url-store.js";
//import Preview from "./preview.js";
import { edit_node, revisions_node } from "./nodes/index.js";

/*const tree = new node("root")
tree.children = [
  new type_node("article", "Pages"),
  new edit_node("www.lotsenturm-usedom.de", "Options"),
];
*/

// const tree = new default_root();

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

    collapsed_width = "30px";

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
        this.addEventListener("open-editor", (e) => this.open_new_editor(e.detail));
        this.addEventListener("open-detail", (e) => this.open_new_detail(e.detail));
        this.addEventListener("close-panel", (e) => this.close(e.detail));
        this.initialize();
    }

    initialize() {
        // this.add_rootpanel();
        console.log("$$$ panelmanager initialize", project.name, project.schema())
        let tree = project.get_structure();
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
        if (name == "Backlinkslist") return new Backlinkslist();
        if (name == "RevisionsPanel") return new RevisionsPanel();
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

    operation = "";

    close(detail) {
        // this.panels.splice(panel - 1, Infinity);
        this.operation = "remove";

        let panel = detail.panel;
        this.panels.splice(panel, Infinity);
        console.log("$$$ request close panel", panel, this.panels);
        this.render();
    }

    open_new_editor(preview) {
        console.log("$$ make panel request new panel", preview, preview.panel);
        let before = this.panels.length;
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
        if (this.panels.length > before) this.operation = "add";
        this.render();
    }

    open_new_detail(detail) {
        console.log("$$ make panel for detail", detail, detail.panel);
        let before = this.panels.length;

        let node = this.panels[detail.panel].node
        let newnode = node.detail(detail.id)
        console.log("$$ details node", node, newnode);

        let panel = this.make_panel(detail.id, detail.panel + 1, newnode);
        panel.doc_id = detail.id;

        this.panels.splice(detail.panel + 1, Infinity, panel);
        let active = this.panels.map((p) => p.doc_id);
        console.log("$$$ path", active);
        // das root panel brauchen wir nicht
        active.shift();
        urlStore.set_array("z", active);
        if (this.panels.length > before) this.operation = "add";
        this.render();
    }
    collapse(e) {
        this.adjust_panel_width(e.detail.index, this.collapsed_width);
    }
    expand(e) {
        this.adjust_panel_width(e.detail.index);
    }

    adjust_panel_width(panelindex, size) {
        let sizes = this.container.style["grid-template-columns"].split(" ");
        console.log(
            "splitter+++ adjust_panel_width BEFORE", panelindex, size, sizes, "=>",
            // this.splitter,
            this.container.style["grid-template-columns"]
        );

        let idx = panelindex * 2;
        if (!size) size = this.default_panel_width(panelindex);
        sizes[idx] = size;
        this.container.style["grid-template-columns"] = sizes.join(" ");
        console.log(
            "splitter+++ adjust_panel_width", panelindex, size, "=>",
            // this.splitter,
            this.container.style["grid-template-columns"]
        );
    }
    default_panel_width(idx) {
        if (this.panels[idx].default_width) return this.panels[idx].default_width;
        if (idx == 0) return "200px";
        if (idx == this.panels.length - 1)
            return "1fr";
        // return "" + this.container.clientWidth / 2 + "px";
        return "300px";
    }
    current_panel_widths() {
        let sizes = this.container.style["grid-template-columns"];
        if (!sizes) return [];
        return sizes.split(" ").filter((_, i) => i % 2 == 0)
    }
    render() {
        console.log("$$ make panel render", this.panels);
        let before = this.current_panel_widths();
        console.log(
            "splitter+++ render BEFORE", this.operation, before,
            "=>",
            this.container.style["grid-template-columns"]
        );
        let container = this.container;
        let add = [];
        let cols = [];
        let last = this.panels.length - 1;
        let stable = (this.operation == "" && before.length);
        this.panels.forEach((p, idx) => {
            add.push(p);
            if (stable) {
                cols.push(before[idx]);
            } else {
                cols.push(p.collabsed ? this.collapsed_width : this.default_panel_width(idx));
            }

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
            this.splitter.destroy();
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
        this.operation = "";
        console.log(
            "splitter+++ render",
            this.splitter, "=>",
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
