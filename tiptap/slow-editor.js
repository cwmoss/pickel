// import { Editor, Extension, Node } from "https://esm.sh/@tiptap/core";
// import StarterKit from "https://esm.sh/@tiptap/starter-kit";

import {
    Editor,
    Extension,
    Node,
    StarterKit,
    BubbleMenu,
    Markdown,
    Mention,
    Suggestion
} from "./dist/tiptap-bundle.js";
import { CustomExtension } from "./custom-extension.js";
import { CustomNode } from "./custom-nodes.js";
import { Toolbar } from "./toolbar.js";

import UnusedBubbleMenu from "./bubble-menu.js";
import EditorTopMenu from "./editor-top-menu.js";
import SuggestMenu from "./suggest-menu.js";
import PlaceholderMention from "./placeholder-mention.js";

let jcontent = `
{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Bericht: KI-Coding-Tools verursachten Ausfälle bei Amazon"}]},{"type":"paragraph","content":[{"type":"text","text":"Nach Ausfällen im März führt Amazon strengere Kontrollen für KI-generierten Code ein. Interne Berichte sehen mangelnde Sicherheitsmechanismen als Ursache."}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://app-eu.readspeaker.com/cgi-bin/rsent?customerid=4407&lang=de_de&readid=meldung&url=https%3A%2F%2Fwww.heise.de%2Fnews%2FBericht-KI-Coding-Tools-verursachten-Ausfaelle-bei-Amazon-11205724.html%3Fseite%3Dall","target":"_blank","rel":"nofollow noopener noreferrer","class":"a-article-action          js-article-header__readspeaker","title":"Beitrag vorlesen und MP3-Download"}}],"text":"vorlesen "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.heise.de/news/Bericht-KI-Coding-Tools-verursachten-Ausfaelle-bei-Amazon-11205724.html?view=print","target":"_blank","rel":"nofollow","class":"\\n    link\\n    a-article-action a-u-show-from-tablet\\n  ","title":"Druckansicht"}}],"text":"Druckansicht "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.heise.de/forum/heise-online/Kommentare/Bericht-KI-Coding-Tools-verursachten-Ausfaelle-bei-Amazon/forum-578975/comment/","target":"_blank","rel":"noopener noreferrer nofollow","class":"a-article-action","title":"Kommentar lesen"}}],"text":"56 Kommentare lesen"}]},{"type":"paragraph","content":[{"type":"text","text":"(Bild: JHVEPhoto / "},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://Shutterstock.com","target":"_blank","rel":"noopener noreferrer nofollow","class":null,"title":null}}],"text":"Shutterstock.com"},{"type":"text","text":")"}]},{"type":"paragraph","content":[{"type":"text","text":"13:17 Uhr"}]},{"type":"paragraph","content":[{"type":"text","text":" Lesezeit: 2 Min."}]},{"type":"paragraph","content":[{"type":"text","text":" Von"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://www.heise.de/autor/Malte-Kirchner-3659878","target":"_blank","rel":"noopener noreferrer nofollow","class":"creator__link","title":null}}],"text":"Malte Kirchner"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Der Gebrauch von KI-Coding-Tools soll bei Amazon zu Ausfällen seiner E-Commerce-Plattform geführt haben. Laut einem Bericht wurde deshalb ein bislang freiwilliges wöchentliches Meeting umgewidmet, an dem alle beteiligten Entwickler teilnehmen müssen. Ein erstes Ergebnis: Künftig sollen KI-assistierte Code-Änderungen nur noch nach Prüfung durch erfahrene Kräfte freigegeben werden."}]},{"type":"paragraph","content":[{"type":"text","text":"Anfang März soll es zu knapp sechsstündigen Ausfällen auf "},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://Amazon.com","target":"_blank","rel":"noopener noreferrer nofollow","class":null,"title":null}}],"text":"Amazon.com"},{"type":"text","text":" und in der Shopping-App gekommen sein. Kunden konnten dem Bericht zufolge keine Käufe tätigen, ihre Daten oder Preise abrufen. Als Ursache wurde offiziell eine fehlerhafte Software-Aktualisierung genannt."}]}]}`;

let tpl = `

`;
let placeholder = [
    { id: "kun_anrede", "label": "Anrede", "ex": "Herr Dr. Müller" },
    { id: "kun_nr", "label": "Kundennummer", "ex": "030143850" },
    { id: "son_heute", "label": "Tagesdatum", "ex": "14.7.2026" },
]
let suggest = {
    decorationTag: 'suggestion-decorator',
    char: '$',
    items: ({ query }) => {
        return placeholder.filter((it) =>
            it.id.toLowerCase().includes(query.toLowerCase()) || it.label.toLowerCase().includes(query.toLowerCase())
        )
    },
    render: () => {
        let popup

        return {
            onStart: (props) => {
                // decorationNode
                console.log("suggestion starts", props);
                // props.decorationNode.items = props.items;

                popup = document.createElement('suggest-menu')
                // popup.cb = props.command;

                console.log("popup created");
                // popup.sprops = props
                // popup.id = "p100";
                // popup.setAttribute("popover", "manual");
                popup.classList.add('suggestion-popup')
                popup.items = props.items;
                /*props.items.forEach((item) => {
                    const button = document.createElement('button')
                    button.textContent = item
                    button.addEventListener('click', () => props.command({ id: item }))
                    popup.appendChild(button)
                })*/
                popup.addEventListener("s-select", (ev) => props.command({ id: ev.detail.id, label: ev.detail.id, process: "as_date", ex: ev.detail.ex }))
                // popup.cb = (it) => props.command({ id: it })
                document.body.appendChild(popup)
                // props.decorationNode.popoverTargetElement = popup
                // props.decorationNode.setAttribute("popovertarget", "p100");
                popup.showPopover({ source: props.decorationNode })
            },
            onUpdate: (props) => {
                // popup.sprops = props
                // props.decorationNode.items = props.items;
                // props.decorationNode.setAttribute("popovertarget", "p100");
                popup.items = props.items
                // popup.cb = (it) => props.command({ id: it })
                /* popup.innerHTML = ''
                props.items.forEach((item) => {
                    const button = document.createElement('button')
                    button.textContent = item
                    button.addEventListener('click', () => props.command({ id: item }))
                    popup.appendChild(button)
                })
                    */
            },
            onExit: () => {
                popup?.remove()
            },
        }
    },
}

const PlaceholderMentionNode = Mention.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            process: {
                default: null,
                parseHTML: (element) => {
                    return {
                        uuid: element.getAttribute("data-mention-process")
                    };
                },
                renderHTML: (attributes) => {
                    if (!attributes.process) {
                        return {};
                    }

                    return {
                        "data-mention-process": attributes.process
                    };
                }
            },
            ex: {
                default: null,
            }
        }
    },
})

console.log("!!!! suggest", suggest);

let mentions = PlaceholderMentionNode.configure({

    HTMLAttributes: {
        class: 'mention',
    },
    suggestion: suggest,
    renderHTML: ({ options, node }) => ['placeholder-mention', { 'data-type': 'mention', 'mention': `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`, 'title': `ex. ${node.attrs.ex}` }, `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`]
})

export default class SlowEditor extends HTMLElement {
    top_toolbar = null;
    bubble_toolbar = null;

    connectedCallback() {
        this.init();
        this.render();
        this.start_editor();
    }

    init() {
        this.top_menu = document.createElement("editor-top-menu");
        this.make_bubble();
        this.editor_el = document.createElement("div");
        this.debug_out = document.createElement("output");
        this.addEventListener("do-action", this.action);
        this.addEventListener("menu-select", this.menu_action);
        this.bm = BubbleMenu.configure({
            element: this.bubble_menu,
            options: {
                strategy: "absolute",
                placement: "top-start",
                onShow: () => {
                    console.log("showing bubble menu");
                    this.update_bubble();
                    // this.bubble_menu.show()
                },
            },
        });
    }

    make_bubble() {
        let bm = document.createElement("bubble-menu");
        this.bubble_toolbar = new Toolbar("bubble");
        this.bubble_toolbar
            .add("toggleBold", "bold")
            .add("toggleItalic", "italic");
        bm.items = this.bubble_toolbar.items_for_menu();
        this.bubble_menu = bm;
        this.bubble_menu.disconnected_render();
    }
    update_bubble() {
        this.bubble_toolbar.items.forEach((it) => {
            if (this.ed.isActive(it.title)) {
                it.active = true;
            } else {
                it.active = false;
            }
        });
        this.bubble_menu.update_items(this.bubble_toolbar.items_for_menu());
        console.log("update bubble", this.bubble_toolbar);
    }
    render() {
        this.appendChild(this.top_menu);
        this.appendChild(this.editor_el);
        this.appendChild(this.debug_out);
    }

    start_editor() {
        this.ed = new Editor({
            element: this.editor_el,
            extensions: [
                StarterKit,
                CustomNode,
                CustomExtension,
                this.bm,
                Markdown,
                mentions
            ],
            content: JSON.parse(jcontent), // "<p>Hello from CDN!</p>",
        });

        console.log("$ slow editor", this.ed);
    }

    menu_action(ev) {
        console.log("toolbar event", ev);
        if (ev.detail?.item?.command) {
            this.ed.chain().focus()[ev.detail.item.command]().run();
            this.update_bubble();
        }
    }

    action(ev) {
        console.log("toolbar event", ev);
        if (ev.detail.action == "save") {
            let j = this.ed.getJSON();
            console.log("save", j);
            this.debug_out.innerHTML = `<pre>${JSON.stringify(j)}</pre>`;
        }
        if (ev.detail.action == "save_md") {
            let j = this.ed.getMarkdown();
            console.log("save md", j);
            this.debug_out.innerHTML = `<pre>${j}</pre>`;
        }
    }
}

customElements.define("slow-editor", SlowEditor);

/*
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
        */
