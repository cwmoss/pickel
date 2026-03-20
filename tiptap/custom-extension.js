import { Extension } from './dist/tiptap-bundle.js'

export const CustomExtension = Extension.create(() => {
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
