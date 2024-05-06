let templates = {};

class PageElement extends HTMLElement {
  constructor() {
    super();
    this.load_template();
  }
  async load_template() {
    let klas = this.constructor.name;
    console.log("++ page", klas);
    if (!templates[klas]) {
      console.log("++loading template");
      let tpl = await fetch(`/src/pages/${klas.toLowerCase()}.html`);
      let text = tpl.text();
      let parser = new DOMParser();
      let doc = parser.parseFromString(text, "text/html");
      templates[klas] = doc.body;
      console.log("++ loaded doc", doc);
    }

    return templates[klas];
  }
}
/*

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template?retiredLocale=de
https://gomakethings.com/articles/
https://github.com/zachlankton/quick-custom-elements
*/

export default PageElement;
