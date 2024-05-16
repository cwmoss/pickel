import { LitElement, css, html } from "./../vendor/lit-core.min.js";
import { set_schema, get_schema_type } from "./form-elements/schema.js";
import testschema from "./testschema.js";
import Container from "./form-elements/b_container.js";
set_schema(testschema);

let test = {
  author: {
    type: document,
  },
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
    schema: { attribute: false },
    document: {},
    value: { type: Object },
    container: { type: Object, attribute: false },
  };

  constructor() {
    super();
    let type = this.getAttribute("document");
    // this.value = {};
    console.log("+++ value", this.getAttribute("value"), this.value);
    this.schema = get_schema_type(type);

    this.form = this.parentElement;
    this.form.addEventListener("submit", (e) => this.submit(e));
    //this.schema = test;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("++connected", this.value);
    this.container = new Container();
    this.container.value = this.value;
    this.container.prefix = "random";
    this.container.type = this.document;
  }

  submit(e) {
    let data = new FormData(this.form);
    console.log("save", data, this.form, this.to_json2(data));
    e.preventDefault();
    return false;
  }
  // ${this.container}
  render() {
    console.log("render formbuilder", this.value, this.container);
    return html`builder for: ${this.document} (${this.schema}})<br />
      <button primary class="btn">Save</button><br />
      ${this.container}`;
  }
  update_serialize(data, keys, value) {
    if (keys.length === 0) {
      // Leaf node
      return value;
    }

    let key = keys.shift();
    if (!key) {
      data = data || [];
      if (Array.isArray(data)) {
        key = data.length;
      }
    }

    // Try converting key to a numeric value
    let index = +key;
    if (!isNaN(index)) {
      // We have a numeric index, make data a numeric array
      // This will not work if this is a associative array
      // with numeric keys
      data = data || [];
      key = index;
    }

    // If none of the above matched, we have an associative array
    data = data || {};

    let val = this.update_serialize(data[key], keys, value);
    data[key] = val;

    return data;
  }
  /*
https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
*/
  to_json2(fdata) {
    return Array.from(fdata.entries()).reduce((data, [field, value]) => {
      let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);

      if (keys) {
        keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), (m) => m[1]);
        value = this.update_serialize(data[prefix], keys, value);
      }
      data[prefix] = value;
      return data;
    }, {});
  }
  to_json(fdata) {
    const f = Array.from(fdata);
    const obj = f.reduce((o, [k, v]) => {
      let a = v,
        b,
        i,
        m = k.split("["),
        n = m[0],
        l = m.length;
      if (l > 1) {
        a = b = o[n] || [];
        for (i = 1; i < l; i++) {
          m[i] = (m[i].split("]")[0] || b.length) * 1;
          b = b[m[i]] = i + 1 == l ? v : b[m[i]] || [];
        }
      }
      return { ...o, [n]: a };
    }, {});
    return obj;
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("form-builder", FormBuilder);