import { Editor, Extension, Node } from "https://esm.sh/@tiptap/core";
import StarterKit from "https://esm.sh/@tiptap/starter-kit";

import BubbleMenu from "./bubble-menu.js";

// import { Editor, Extension, Node } from '@tiptap/core'
// import StarterKit from '@tiptap/starter-kit'

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

let jcontent = `
{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Bericht: KI-Coding-Tools verursachten Ausfälle bei Amazon"}]},{"type":"paragraph","content":[{"type":"text","text":"Nach Ausfällen im März führt Amazon strengere Kontrollen für KI-generierten Code ein. Interne Berichte sehen mangelnde Sicherheitsmechanismen als Ursache."}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=4407&lang=de_de&readid=meldung&url=https%3A%2F%2Fwww.heise.de%2Fnews%2FBericht-KI-Coding-Tools-verursachten-Ausfaelle-bei-Amazon-11205724.html%3Fseite%3Dall","target":"_blank","rel":"nofollow noopener noreferrer","class":"a-article-action          js-article-header__readspeaker","title":"Beitrag vorlesen und MP3-Download"}}],"text":"vorlesen "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.heise.de/news/Bericht-KI-Coding-Tools-verursachten-Ausfaelle-bei-Amazon-11205724.html?view=print","target":"_blank","rel":"nofollow","class":"\\n    link\\n    a-article-action a-u-show-from-tablet\\n  ","title":"Druckansicht"}}],"text":"Druckansicht "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.heise.de/forum/heise-online/Kommentare/Bericht-KI-Coding-Tools-verursachten-Ausfaelle-bei-Amazon/forum-578975/comment/","target":"_blank","rel":"noopener noreferrer nofollow","class":"a-article-action","title":"Kommentar lesen"}}],"text":"56 Kommentare lesen"}]},{"type":"paragraph","content":[{"type":"text","text":"(Bild: JHVEPhoto / "},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://Shutterstock.com","target":"_blank","rel":"noopener noreferrer nofollow","class":null,"title":null}}],"text":"Shutterstock.com"},{"type":"text","text":")"}]},{"type":"paragraph","content":[{"type":"text","text":"13:17 Uhr"}]},{"type":"paragraph","content":[{"type":"text","text":" Lesezeit: 2 Min."}]},{"type":"paragraph","content":[{"type":"text","text":" Von"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.heise.de/autor/Malte-Kirchner-3659878","target":"_blank","rel":"noopener noreferrer nofollow","class":"creator__link","title":null}}],"text":"Malte Kirchner"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Der Gebrauch von KI-Coding-Tools soll bei Amazon zu Ausfällen seiner E-Commerce-Plattform geführt haben. Laut einem Bericht wurde deshalb ein bislang freiwilliges wöchentliches Meeting umgewidmet, an dem alle beteiligten Entwickler teilnehmen müssen. Ein erstes Ergebnis: Künftig sollen KI-assistierte Code-Änderungen nur noch nach Prüfung durch erfahrene Kräfte freigegeben werden."}]},{"type":"paragraph","content":[{"type":"text","text":"Anfang März soll es zu knapp sechsstündigen Ausfällen auf "},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://Amazon.com","target":"_blank","rel":"noopener noreferrer nofollow","class":null,"title":null}}],"text":"Amazon.com"},{"type":"text","text":" und in der Shopping-App gekommen sein. Kunden konnten dem Bericht zufolge keine Käufe tätigen, ihre Daten oder Preise abrufen. Als Ursache wurde offiziell eine fehlerhafte Software-Aktualisierung genannt."}]}]}`;

let ed = new Editor({
    element: document.querySelector(".editor"),
    extensions: [StarterKit, CustomNode, CustomExtension],
    content: JSON.parse(jcontent), // "<p>Hello from CDN!</p>",
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
    console.log("save", j, JSON.stringify(j));
    _code.innerHTML = JSON.stringify(j);
});
let menu = document.querySelector("bubble-menu");
_bubble.addEventListener("click", (e) => {
    menu.show(e.target);
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
