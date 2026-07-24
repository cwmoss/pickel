import { LitElement, css, html, nothing } from "lit";
import Base from "./base.js";

export default class PiInput extends Base {
    render() {
        console.log("render PiINPUT", this.name);
        return html`
            ${this.render_label()}
            <input
                type="text"
                id="input"
                name=${this.name}
                value=${this._first_rendered ? nothing : (this.value ?? "")}
                .value=${!this._first_rendered ? nothing : (this.value ?? "")}
                @input=${this.input_event}
                ?required=${this.required}
                maxlength=${this.maxlength || nothing}
            />
            ${this.render_feedback()}
            <slot></slot>
        `;
    }
}

customElements.define("pi-input", PiInput);

/*

https://github.com/whatwg/html/issues/9639


ValidityState { valueMissing: true, typeMismatch: false, patternMismatch: false, tooLong: false, tooShort: false, rangeUnderflow: false, rangeOverflow: false, stepMismatch: false, badInput: false, customError: false }

badInput: false
customError: false
patternMismatch: false
rangeOverflow: false
rangeUnderflow: false
stepMismatch: false
tooLong: false
tooShort: false
typeMismatch: false
valid: false
valueMissing: true


validationMessage

valueAsDate
valueAsNumber
*/
