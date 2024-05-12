import Split from "../vendor/split.js";
import Panel from "./panel.js";
const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
.split {
    display: flex;
    flex-direction: row;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>


<div class="panels split"></div>

`;

export default class Panels extends HTMLElement {
  constructor() {
    super()
      .attachShadow({ mode: "open" })
      .appendChild(template.content.cloneNode(true));
    this.panels = [];
  }
  connectedCallback() {
    this.panels.push(this.make_panel("docs"), this.make_panel("editor"));
    this.render();
    window.setTimeout(() => {
      this.panels.push(this.make_panel("preview"));
      this.render();
    }, 3000);
  }
  render() {
    let container = this.shadowRoot.querySelector(".panels");
    container.replaceChildren();
    container.append(...this.panels);
    Split(this.panels);
  }
  make_panel(title) {
    let p = new Panel();
    p.setAttribute("title", title);
    let div = document.createElement("div");
    div.appendChild(p);
    return div;
  }
}
