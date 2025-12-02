import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Face from "./face.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../lib/util.js";

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
  static properties = { ...Face.properties, prefix: {}, suffix: {} };
  static styles = [style];
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.init());
  }

  init() {
    this.textarea = this.shadowRoot.querySelector("textarea");
    this.easyMDE = new EasyMDE({
      element: this.textarea,
      autoDownloadFontAwesome: false,
      spellChecker: false,
      minHeight: "100px",
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
    console.log("FACE init MD", this.text)
    this.easyMDE.value(this.text);
  }
  get text() {
    let text = api.block_to_text(this._value);
    // console.log("++ text ++", text);
    return text;
  }

  get xvalue() {
    console.log("md text get value")
    return this.fetch_value()
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
    return html`<link rel="stylesheet" href="mde/easymde.min.css" class="rel" />
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
