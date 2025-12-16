import project from "../../lib/project.js";
import node from "./node.js";
import type_node from "./type_node.js";

export default class default_root extends node {

    constructor(id = "root", title = "documents", root_types = []) {
        super(id, title, []);
        this.set_root_nodes(root_types)
    }

    set_root_nodes(root_types) {
        let schema = project.schema();
        if (!root_types.length) {
            console.log("=> set root types from schema", schema.name, schema);
            root_types = schema.document_types
        }
        let nodes = root_types.map((type) => {
            let doc = schema.get_type(type)
            return new type_node(type, doc?.title || type)
        });
        this.children = nodes
    }

}