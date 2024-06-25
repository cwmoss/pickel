import api from "../lib/slow-hand.js";

// https://stackoverflow.com/questions/8729193/how-to-get-all-parent-nodes-of-given-element-in-pure-javascript
const getParents = (el) => {
  for (var parents = []; el; el = el.parentNode) {
    parents.push(el);
  }

  return parents;
};

export const get_document = (element) => {
  /*
  Array(8) [ pi-slug, div.els, b-container, section, form#editor, div.child--content, div.wrapper.panel, ShadowRoot ]
  host: sh-editor
  console.log("++ parents", getParents(element));
  */

  let evt = new CustomEvent("get-document", {
    detail: {},
    bubbles: true,
    composed: true,
  });
  element.dispatchEvent(evt);
  return evt.detail.data;
  // return element.closest("sh-editor").container.get_updated_data();
};

export { api };
