import router from "./vendor/page.mjs";
import routes from "./routes.js";

// let router = window.page;
router.configure({ window: window });

class App extends HTMLElement {
  constructor() {
    super();
    this.define_routes();
    // this.innerHTML = layout;
  }

  connectedCallback() {
    window.setTimeout(() => {
      this.content = this.querySelector("main");
      this.nav = this.querySelector("pi-navigation");
      router();
    });
  }

  async load_page(name, ctx) {
    let path = "./pages/" + name + ".js";
    const { default: PageClass } = await import(path);
    let page = new PageClass();
    page.set_route(ctx);

    console.log("loaded page", page);
    this.content.replaceChildren(page);
    this.nav.active(ctx.pathname);

    // this.content.innerHTML = `<${name}-page></${name}-page>`;
  }
  define_routes() {
    for (const [path, props] of Object.entries(routes)) {
      // console.log(`${key}: ${value}`);
      router(path, (ctx, next) => {
        ctx.route = props;
        this.load_page(props.class, ctx);
      });
    }
  }
}

customElements.define("pi-app", App);
