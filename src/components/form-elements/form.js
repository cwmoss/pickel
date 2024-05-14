import Input from "./input.js";
import Object from "./object.js";
const template = document.createElement("template");

template.innerHTML = /*html*/ `
<link rel="stylesheet" href="${
  import.meta.url
}/../variables.css" type="text/css">
<link rel="stylesheet" href="${
  import.meta.url
}/../bootstrap.min.css" type="text/css">
<style>

:host{
    display:block;
    padding: 1rem;
    font-family: var(--bs-body-font-family);
}
form{

}

</style>

<div class="container">
<form>
<button class="btn btn-primary mb-5">Speichern</button>
<div class="invalid-feedback"></div>
</form>
</div>
`;

export default class Form extends HTMLElement {
  // static formAssociated = true;
  // static observedAttributes = ["value"];

  constructor() {
    // Inititialize custom component
    super();
    //this.attachShadow({ mode: "open" });
    // this.internals = this.attachInternals();
    this.appendChild(template.content.cloneNode(true));
    this.els = {
      form: this.querySelector("form"),
      button: this.querySelector("button"),
      error: this.querySelector(".invalid-feedback"),
    };
    console.log("form-els", this.els);
    this.els.form.addEventListener("submit", (e) => this.save(e));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // this.internals.setFormValue(newValue);
  }

  save(e) {
    let data = new FormData(this.els.form);
    console.log("save", data, this.els.form);
    e.preventDefault();
    return false;
  }

  set props(p) {
    this._label = p.label;
    this._name = p.name;
    this._id = p.id;
  }

  render() {
    let el = new Input();
    el.props = { label: "E-Mail-Adresse", name: "email", id: "email" };
    el.setAttribute("value", "horst@example.com");
    this.els.form.appendChild(el);
    let obj = new Object();
    this.els.form.appendChild(obj);
  }
}

customElements.define("pi-form", Form);
