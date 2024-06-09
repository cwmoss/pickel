export default class SchemaObject {
    constructor(attrs) {
        this._spec = {};
        if (attrs) {
            this._spec = attrs._spec || attrs;
        }
        this.model = null;
        this.collapsed = null;
        this.parent = null;
        this.field = null;
    }

    setModel(model) {
        this.model = model;
        return this;
    }

    setCollapsed(collapsed) {
        this.collapsed = collapsed;
        return this;
    }

    setParent(parent) {
        this.parent = parent;
        return this;
    }

    setField(field) {
        this.field = field;
        return this;
    }

    clone(attrs) {
        attrs = Object.fromEntries(
            Object.entries(attrs).map(([k, v]) => [k.startsWith('_') ? k : `_${k}`, v])
        );
        Object.assign(this, attrs);
        return this;
    }

    get(prop) {
        return this[prop.startsWith('_') ? prop : `_${prop}`] || this._spec[prop] || this._spec[`_${prop}`];
    }
}