import Input from "./input.js";

const template = document.createElement("template");

template.innerHTML = /*html*/ `
<link rel="stylesheet" href="${
  import.meta.url
}/../bootstrap.min.css" type="text/css">
<div class="fobject">
</div>
`;

export default class Subobject extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ["value"];

  constructor() {
    // Inititialize custom component
    super();
    this.attachShadow({ mode: "open" });
    this.internals = this.attachInternals();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.fields = [];

    let f = new Input();
    f.props = {
      name: "address[verwendung][hauptadresse]",
      id: "address_verwendung_hauptadresse",
      label: "Ist Hauptadresse?",
    };
    this.fields.push(f);

    this.els = {
      root: this.shadowRoot.querySelector(".fobject"),
    };
    this.fields.forEach((el) => {
      el.addEventListener("input", (e) => this.update_value(e));
    });
  }

  update_value(e) {
    let data = new FormData();
    console.log("+++ subobject value first element", e, this.fields[0]);
    data.append(this.fields[0]._name, this.fields[0].value);
    //data.append(this.fields[1]._name, this.fields[1].value);
    this.internals.setFormValue(data);
    console.log("subobject set value", data);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("++ new value", newValue, this);
    this.internals.setFormValue(newValue);
    this.render();
  }

  set value(v) {
    this.setAttribute("value", v);
  }

  get value() {
    console.log("someone tries to get this value");
  }
  set props(p) {
    this._label = p.label;
    this._name = p.name;
    this.setAttribute("name", p.name);
    this._id = p.id;
    this.setAttribute("id", p.id);
  }

  render() {
    //this.els.root.appendChild(...this.fields);
    console.log("render subobject", this.fields);
    this.fields.map((f) => this.els.root.appendChild(f));
  }
}

customElements.define("form-subobject", Subobject);
