import node from "./node.js";
import edit_node from "./edit_node.js";

export default class type_node extends node {
    element = "Doclist"

    constructor(name, title) {
        super(name, title, []);

    }

    find_child(id) {
        return new edit_node(id, "Edit " + id);
    }
}