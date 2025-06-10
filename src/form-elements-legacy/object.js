import Input from "./input.js";
import Subobject from "./subobject.js";
const template = document.createElement("template");

template.innerHTML = /*html*/ `
<link rel="stylesheet" href="${
  import.meta.url
}/../bs-only-form.css" type="text/css">
<div class="fobject">
</div>
`;

export default class Object extends HTMLElement {
  //static formAssociated = true;
  //static observedAttributes = ["value"];

  constructor() {
    // Inititialize custom component
    super();
    //this.attachShadow({ mode: "open" });
    //this.internals = this.attachInternals();
    this.appendChild(template.content.cloneNode(true));
    this.fields = [];
    let f = new Input();
    f.props = {
      name: "address[street]",
      id: "address_street",
      label: "Straße",
    };
    this.fields.push(f);
    f = new Input();
    f.props = { name: "address[city]", id: "address_city", label: "Ort" };
    this.fields.push(f);

    f = new Subobject();
    this.fields.push(f);

    this.els = {
      root: this.querySelector(".fobject"),
    };
    this.fields.forEach((el) => {
      // el.addEventListener("input", (e) => this.update_value(e));
    });
  }

  update_value(e) {
    let data = new FormData();
    console.log("+++ object value first element", e, this.fields[0]);
    data.append(this.fields[0]._name, this.fields[0].value);
    data.append(this.fields[1]._name, this.fields[1].value);
    this.value = data;
    console.log("object set value", data);
  }

  get value() {
    return this.value;
  }
  set value(v) {
    this._value = v;
    this.internals.setFormValue(this._value);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("++ new value", newValue, this);
    this.internals.setFormValue(newValue);
    this.render();
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
    console.log("render object", this.fields);
    this.fields.map((f) => this.els.root.appendChild(f));
  }
}

customElements.define("form-object", Object);
