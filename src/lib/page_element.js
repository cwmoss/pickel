import { load_template } from "./template.js";

class PageElement extends HTMLElement {
  constructor() {
    super();
    this.loading = load_template(this); //this.load_template();
    // console.log("^^title?", this.title, this.constructor);
    if (this.title) {
      window.document.title = this.title;
    }
    this.style.display = "block";
  }

  async connectedCallback() {
    await this.render();
    await this.init();
  }

  async render() {
    let template = await this.loading;
    console.log("++render", template);
    const clone = template[0].content.cloneNode(true);
    this.appendChild(clone);
  }
  async xxxload_template() {
    let klas = this.constructor.name;
    console.log("++ page", klas);
    if (!templates[klas]) {
      console.log("++loading template", klas);
      let tpl = await fetch(
        `${import.meta.url}/../../pages/${klas.toLowerCase()}.html`
      );
      let text = await tpl.text();
      let parser = new DOMParser();
      let doc = parser.parseFromString(text, "text/html");
      templates[klas] = doc.querySelectorAll("template");
      console.log("++ loaded doc", doc.querySelectorAll("template"));
    }

    return templates[klas];
  }

  init() {}

  set_route(r) {
    console.log("++ set route", r);
  }
}
/*

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template?retiredLocale=de
https://gomakethings.com/articles/
https://github.com/zachlankton/quick-custom-elements
https://stackoverflow.com/questions/55479511/access-javascript-class-property-in-parent-class
https://gist.github.com/goloroden/c976971e5f42c859f64be3ad7fc6f4ed?permalink_comment_id=2887444/1000
*/

export default PageElement;
