import { LitElement, css, html } from "./../vendor/lit-core.min.js";

let test = {
  email: {},
  address: {
    type: "object",
    fields: {
      street: {},
      city: {},
    },
  },
};

export default class FormBuilder extends LitElement {
  static properties = {
    schema: {},
    value: "",
  };

  constructor() {
    super();
    //this.schema = test;
  }

  render() {
    return html`<input type="text" name="email" value="${this.value}" />Hello!`;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("form-builder", FormBuilder);
