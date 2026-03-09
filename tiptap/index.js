// import { Editor, Extension, Node } from "https://esm.sh/@tiptap/core";
// import StarterKit from "https://esm.sh/@tiptap/starter-kit";

import { Editor, Extension, Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const CustomNode = Node.create(() => {
    // here you could define variables or function that you can use on your schema definition
    const customVariable = "shx";

    function onCreate() { }
    function onUpdate() { }

    function addOptions() {
        return {
            HTMLAttributes: {},
        };
    }

    function parseHTML() {
        return [
            {
                tag: "section",
            },
        ];
    }

    function renderHTML({ HTMLAttributes }) {
        return ["editor-block-element-html-output", HTMLAttributes, 0];
    }

    function addNodeView() {
        return ({
            editor,
            node,
            getPos,
            HTMLAttributes,
            decorations,
            extension,
        }) => {
            const dom = document.createElement("div");
            // dom.innerHTML = "Hello, I’m a node view!";
            const el = document.createElement("editor-block-element");
            el.shid = "i-am-in-the-editor";
            dom.appendChild(el);
            return {
                dom,
            };
        };
    }
    function addAttributes() {
        return {
            shid: {
                default: "cvalue",
                parseHTML: (element) => element.getAttribute("data-shid"),
            },
        };
    }
    function addCommands() {
        return {
            addCNode:
                () =>
                    ({ commands }) => {
                        return commands.setContent("addSlowNode command executed");
                    },
        };
    }
    // https://github.com/ueberdosis/tiptap/discussions/4999
    return {
        name: "slowhandNode",
        onCreate,
        onUpdate,
        addOptions,
        parseHTML,
        addNodeView,
        renderHTML,
        addAttributes,
        selectable: true,
        inline: false,
        group: "block",
        // Your code goes here.
    };
});
const CustomExtension = Extension.create(() => {
    // Define variables or functions to use inside your extension
    const customVariable = "foo";

    function onCreate() { }
    function onUpdate() {
        console.log("custom update:", this.editor.getJSON());
    }

    // editor.commands.customCommand() // 'Custom command executed'
    // editor.chain().customCommand().run() // 'Custom command executed'
    function addCommands() {
        return {
            addSlowNode:
                () =>
                    ({ commands }) => {
                        console.log("custom insertcontent");
                        return commands.insertContent({
                            type: "slowhandNode",
                            attrs: {
                                shid: "hallo-ok-bin-custom",
                            },
                        });
                    },
        };
    }
    function extendNodeSchema() {
        return {
            slowhandId: {
                default: null,
            },
        };
    }
    return {
        name: "customExtension",
        onCreate,
        onUpdate,
        addCommands,
        // Your code goes here.
    };
});

let ed = new Editor({
    element: document.querySelector(".editor"),
    extensions: [StarterKit, CustomNode, CustomExtension],
    content: "<p>Hello from CDN!</p>",
});

let bold = document.querySelector("button.bold");
bold.addEventListener("click", () => {
    ed.chain().focus().toggleBold().run();
    if (ed.isActive("bold")) {
        bold.setAttribute("active", "");
    } else {
        bold.removeAttribute("active");
    }
});
_cblock.addEventListener("click", () => {
    ed.chain().focus().addSlowNode().run();
});
_save.addEventListener("click", () => {
    let j = ed.getJSON();
    console.log("save", j);
    _code.innerHTML = JSON.stringify(j);
});

ed.on("selectionUpdate", ({ editor }) => {
    // The selection has changed.
    console.log("check active", editor.getAttributes("bold"));
    if (editor.isActive("bold")) {
        bold.setAttribute("active", "");
    } else {
        bold.removeAttribute("active");
    }
});
console.log("$ editor", ed);
