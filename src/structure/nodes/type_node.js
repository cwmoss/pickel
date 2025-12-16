import node from "./node.js";
import edit_node from "./edit_node.js";

export default class type_node extends node {
    element = "Doclist"
    type = null
    _query = null

    constructor(type, title, id = null, query = null) {
        if (!id) id = type;
        super(id, title, []);
        this.type = type;
        this._query = query;
    }

    find_child(id) {
        return new edit_node(id, "Edit " + id);
    }

    query() {
        if (this._query) {
            return this._query(this);
        } else {
            return {
                q: `_type=="${this.type}"`,
                opts: {
                    order: {
                        by: "_updatedAt",
                        desc: true,
                    }
                }
            };
        }
    }
}