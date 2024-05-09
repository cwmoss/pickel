const template = document.createElement("template");
template.innerHTML = /*html*/ `
<style>
.panels {
  display:flex;
}

[hidden]{
  display:none;
}
</style>


<div class="panels">
  <slot></slot>
</div>

`;

export default class Panel extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    this.collabsed = this.getAttribute("collabsed");
  }

  handle_collapse(toggle) {
    if (toggle) {
      this.collabsed = !this.collabsed;
    }
    let wrapper = this.shadowRoot.querySelector(".wrapper");
    if (this.collabsed) {
      wrapper.classList.remove("panel");
      wrapper.classList.add("panel-collapsed");
      this.shadowRoot.querySelector("[collabsed]").removeAttribute("hidden");
      this.shadowRoot
        .querySelector("[not-collabsed]")
        .setAttribute("hidden", "");
    } else {
      wrapper.classList.add("panel");
      wrapper.classList.remove("panel-collapsed");
      this.shadowRoot
        .querySelector("[not-collabsed]")
        .removeAttribute("hidden");
      this.shadowRoot.querySelector("[collabsed]").setAttribute("hidden", "");
    }
  }
}
