import edit_node from "./edit_node.js"
// import type_node from "./type_node.js"

export default class node {

    element = "Arraylist"

    constructor(id = "root", title = "documents", children = []) {
        this.id = id
        this.title = title
        this.children = children
    }

    get children() {
        return this._children
    }

    set children(children) {
        this._children = children
    }

    find_child(id) {
        let found = this.children.find((child) => child.id == id)
        // fts AND type node not in root
        if (!found) {
            // return new edit_node(id, "Edit " + id);
        }
        return found
    }
}

