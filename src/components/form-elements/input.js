const template = document.createElement("template");

template.innerHTML = /*html*/ `
<link rel="stylesheet" href="${
  import.meta.url
}/../variables.css" type="text/css">
<link rel="stylesheet" href="${
  import.meta.url
}/../bs-only-form.css" type="text/css">
<style>
.fgroup{
  margin-bottom:1.5rem;
}
</style>
<div class="fgroup">
    <label class="form-label"></label>
    <input type="text" class="form-control">
    <div class="invalid-feedback"></div>
</div>
`;

export default class Input extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ["value"];

  constructor() {
    // Inititialize custom component
    super();
    this.attachShadow({ mode: "open" });
    this.internals = this.attachInternals();
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.els = {
      label: this.shadowRoot.querySelector("label"),
      field: this.shadowRoot.querySelector("input"),
      error: this.shadowRoot.querySelector(".invalid-feedback"),
    };
    this.els.field.addEventListener("input", (e) => {
      console.log("++ input ev.input", this._name, e.target.value);
      this.value = e.target.value;
    });
    this.value = this.getAttribute("value") ?? "";
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("++ new value", newValue, this);
    this.value = newValue;
    this.render();
  }

  set value(v) {
    this._value = v;
    this.internals.setFormValue(this._value);
  }

  get value() {
    return this._value;
    //return "noidea";
    console.log("++ internals get value", this.internals);
    return this.els.field.value;
  }

  set props(p) {
    this._label = p.label;
    this._name = p.name;
    this.setAttribute("name", p.name);
    this._id = p.id;
    this.setAttribute("id", p.id);
  }

  render() {
    this.els.field.value = this.getAttribute("value");
    this.els.label.innerHTML = this._label;
    this.els.label.setAttribute("for", this._id);
    this.els.field.setAttribute("id", this._id);
    this.els.field.setAttribute("name", this._name);
  }
}

customElements.define("form-input", Input);
