import PageElement from "../lib/page_element.js";

export default class Media extends PageElement {
  get title() {
    return "Media";
  }
}

window.customElements.define("media-page", Media);
