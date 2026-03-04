import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";

export default class Number extends Input {
    // static properties = Input.properties;

    get_updated_data() {
        console.log("+++ number get value", this._value);
        let val = "" + this._value;
        if (val == "") return null;
        val = val.replaceAll(/[^0-9,]/g, "").replace(",", ".");
        console.log("+++ to_number", val);
        return parseFloat(val);
        //  return new Number(val);
    }

    xxrender() {
        console.log("number", this._value);
    }
}

customElements.define("pi-number", Number);
