import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";

export default class Number extends Input {

    get_updated_data() {
        let val = "" + this._value;
        if (val == "") return null;
        val = val.replaceAll(/[^0-9,]/g, "").replace(",", ".");
        console.log("+++ to_number", val);
        return parseFloat(val);
        //  return new Number(val);
    }

}

customElements.define("pi-number", Number);
