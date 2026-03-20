import { Node } from './dist/tiptap-bundle.js'

export const CustomNode = Node.create(() => {
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
