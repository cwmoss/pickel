import node from "./node.js";
import edit_node from "./edit_node.js";
export default class revisions_node extends node {

    element = "RevisionsPanel"

    constructor(id, title, parent_id) {
        super(id, title, []);
        this.parent_id = parent_id
    }

    find_child(id) {
        return new edit_node(id, "Edit " + id);
    }
}
