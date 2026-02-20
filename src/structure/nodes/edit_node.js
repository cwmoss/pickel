import node from "./node.js";

export default class edit_node extends node {
    element = "Editor"

    constructor(id, title) {
        super(id, title, []);

    }

    find_child(id) {
        return new edit_node(id, "Edit " + id);
    }
}