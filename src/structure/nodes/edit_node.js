import details_node from "./details_node.js";
import node from "./node.js";
import revisions_node from "./revisions_node.js";

export default class edit_node extends node {
    element = "Editor"

    constructor(id, title) {
        super(id, title, []);

    }

    find_child(id) {
        return new edit_node(id, "Edit " + id);
    }

    detail(id) {
        if (id == "backlinks") return new details_node(id, "Details: " + id, this.id);
        if (id == "revisions") return new revisions_node(id, "Revisions: " + id, this.id);
    }
}
