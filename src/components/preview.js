const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
    :host{
        display:block;
        border-bottom:1px solid rgba(134, 144, 160, 0.4);
    }
    :host([active]){
        /* border:1px solid red; */
        
        background-color:var(--color-accent);
    }
    h2{
        margin:0;
        font-size:1rem;
    }
    p{
        
    }
    [id="var(--selected-id)"] {
      color: red;
      background-color:var(--color-accent);
    }
</style>
<div>
<h2></h2>
<p></p>
</div>
`;

export default class Preview extends HTMLElement {
  constructor() {
    super()
      .attachShadow({ mode: "open" })
      .appendChild(template.content.cloneNode(true));
    this.panel = null;
    this.init = false;
    this.data = {};
  }
  connectedCallback() {
    if (this.init) return;
    this.render();
    this.addEventListener("click", () => this.open());
    this.init = true;
  }
  set_data(data, panel_index) {
    this.data = data;
    this.panel = panel_index;
  }
  open() {
    this.setAttribute("active", "");
    this.dispatchEvent(
      new CustomEvent("open-preview", {
        detail: { panel: this.panel, id: this.data.id },
        bubbles: 1,
        composed: 1,
      })
    );
  }
  render() {
    this.shadowRoot.querySelector("h2").innerHTML = this.data.title;
  }
}
