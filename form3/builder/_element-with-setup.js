class ElementWithSetup extends HTMLElement {
    constructor() {
        super();
        if (Object.prototype.hasOwnProperty.call(this, "safe_setup")) {
            const val = this["safe_setup"]
            delete this["safe_setup"]
            this["safe_setup"] = val
        }
    }

    set safe_setup(props) {
        this._safe_setup = props;
    }
}

export default ElementWithSetup;
