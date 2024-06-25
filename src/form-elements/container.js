import Input from "./input.js";

const template = document.createElement("template");

template.innerHTML = /*html*/ `

<div class="fobject">
</div>
`;

export default class Container extends HTMLElement {
  // static formAssociated = true;
  static observedAttributes = ["value"];

  constructor() {
    // Inititialize custom component
    super();
    //this.attachShadow({ mode: "open" });
    // this.internals = this.attachInternals();
    this.appendChild(template.content.cloneNode(true));
    this.fields = [];

    let f = new Input();
    f.props = {
      name: "zweitadresse[ort]",
      id: "zweitadresse_ort",
      label: "Zweitadresse Ort",
    };
    f.setAttribute("value", "tt");
    this.fields.push(f);

    this.els = {
      root: this.querySelector(".fobject"),
    };
    this.fields.forEach((el) => {
      // el.addEventListener("input", (e) => this.update_value(e));
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.els.root.appendChild(this.fields[0]);
  }
}

customElements.define("form-container", Container);
