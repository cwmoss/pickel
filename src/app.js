import router from "./lib/page.mjs";
// let router = window.page;
router.configure({ window: window });

class App extends HTMLElement {
  constructor() {
    super();
    this.define_routes();
    this.innerHTML = "hi";
    router("/");
  }
  connectedCallback() {}

  async load_page(name) {
    let path = "./pages/" + name + ".js";
    let page = await import(path);
    this.innerHTML = `<${name}-page></${name}-page>`;
  }
  define_routes() {
    router("/", () => this.load_page("index"));
    router("/about", () => this.load_page("about"));
  }
}

customElements.define("pi-app", App);
