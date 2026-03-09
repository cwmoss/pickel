import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../lib/util.js";
import InlineEditorElement from "./inline-editor-element.js";
/*
https://stackoverflow.com/questions/63710162/how-to-load-font-face-in-dynamically-loaded-styles-of-web-component-with-shadow
https://github.com/Ionaru/easy-markdown-editor/issues/491
https://stackoverflow.com/questions/54546007/why-doesnt-font-awesome-work-in-my-shadow-dom

https://github.com/Ionaru/easy-markdown-editor?tab=readme-ov-file#toolbar-icons
*/
let style = css`
    label {
        /* font-weight: 600;*/
        margin-bottom: 0.5rem;
        display: inline-block;
    }
`;

export default class Text extends Face {
    static properties = {
        ...Face.properties,
        value: { noAccessor: true },

        prefix: {},
        suffix: {},
    };
    static styles = [style];

    marked() {
        const youtube = {
            name: "youtube",
            level: "inline",
            start(src) {
                return src.match(/!youtube/)?.index;
            },
            tokenizer(src, tokens) {
                console.log("check yt", src);
                const rule = /^!youtube([^\)\n]+\))/; // Regex for the complete token, anchor to string start
                const match = rule.exec(src);
                if (match) {
                    return {
                        // Token to generate
                        type: "youtube", // Should match "name" above
                        raw: match[0], // Text to consume from the source
                        yid: "//" + match[1].trim() + "//", // Additional custom properties, including
                    };
                }
            },
            renderer(token) {
                console.log("render yt", token);
                let el = document.createElement("inline-editor-element");
                el.setAttribute("val", JSON.stringify(token));
                return el.outerHTML;
            },
            childTokens: [],
        };
        return youtube;
    }
    firstUpdated() {
        this.textarea = this.shadowRoot.querySelector("textarea");
        this.easyMDE = new EasyMDE({
            element: this.textarea,
            autoDownloadFontAwesome: false,
            spellChecker: false,
            minHeight: "100px",
            renderingConfig: {
                markedOptions: { extensions: [this.marked()] },
            },
            onToggleFullScreen: (fs) => {
                console.log("$ fullscreen", fs);
                const evt = new CustomEvent("toggle-fullscreen", {
                    detail: fs,
                    bubbles: true,
                    composed: true,
                });
                this.dispatchEvent(evt);
            },
        });
        console.log(
            "FACE init MD firstupdated",
            this.setup,
            this._value,
            this.text,
        );
        this.easyMDE.value(this.text);
    }
    get text() {
        let text = api.block_to_text(this._value);
        console.log("FACE init MD ++ text ++", text);
        return text;
    }

    get xvalue() {
        console.log("md text get value");
        return this.fetch_value();
        // return this.get_updated_data();
    }

    get_updated_data() {
        // TODO: warum wird das frühzeitig aufgerufen?
        console.log("get MD value");
        if (!this.easyMDE) return this._value;
        return this.easyMDE.value();
    }

    render() {
        console.log("render text");
        return html`<link
                rel="stylesheet"
                href="mde/easymde.min.css"
                class="rel"
            />
            <link
                rel="stylesheet"
                href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"
                integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
                crossorigin="anonymous"
            /><label for="input" class="form-label">${this.label}</label
            ><textarea></textarea>`;
    }
}

customElements.define("pi-text", Text);
