import node from "./node.js";

export default class details_node extends node {
    element = "Arraylist"

    constructor(id, title) {
        super(id, title, []);

    }

    find_child(id) {
        return new edit_node(id, "Edit " + id);
    }
}
