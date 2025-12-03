import router from "../vendor/page.m.js";
import routes from "./routes.js";
import project from "./lib/project.js";
import bus from "./lib/bus.js";
import auth from "./auth/auth.js";
import "./auth/logout.js";

import { load_template } from "./lib/template.js";
// let router = window.page;
router.configure({ window: window });
router.base("/studio");

class App extends HTMLElement {
  page = "";
  projectname = "";
  profile;

  constructor() {
    super();
    this.define_routes();
    // this.innerHTML = layout;
    document.addEventListener("login-successful", async (ev) => {
      this.profile = auth.login_from_wc(ev.detail);
      await project.load_current_project();
      this.update_layout();
      router("/");
    });
    document.addEventListener("logout-successful", async (ev) => {
      auth.logged_out();
      this.profile = null
      this.update_layout();
      router("/");
    });
    this.addEventListener("open-doc", this.opendoc);
    bus.subscribe(bus.ev.page_loaded, (ev) => this.title_change(ev));
    bus.subscribe(bus.ev.project_loaded, (ev) => this.title_change(ev));
  }

  async connectedCallback() {
    this.profile = await auth.first_login;
    if (this.profile) await project.load_current_project();
    let template = await load_template("_layout");
    const clone = template[0].content.cloneNode(true);
    this.appendChild(clone);
    console.log("+++ app connected");
    window.setTimeout(() => {
      this.content = this.querySelector("main");
      this.nav = this.querySelector("pi-navigation");
      console.log("+++ nav => ", this.nav);
      this.update_layout();
      router();
    });
  }

  update_layout() {
    console.log("+++ update layout");
    if (this.profile) {
      this.querySelectorAll("*[initialize-after-login]").forEach(el => el.initialize());
      this.querySelectorAll("*[auth-only]").forEach(el => el.removeAttribute("hidden"));
    } else {
      this.querySelectorAll("*[auth-only]").forEach(el => el.setAttribute("hidden", ""));
    }
  }

  opendoc(e) {
    console.log("$ open-doc", e.detail);
    router(`/desk?z=${e.detail.type}~${e.detail.id}`);
  }

  async load_page(name, ctx) {
    let path = "./pages/" + name + ".js";

    if (!this.profile && !ctx.route.anon) {
      router("/login");
      // router.redirect("/login");
      return;
    }

    const { default: PageClass } = await import(path);
    let page = new PageClass();
    page.set_route(ctx);

    this.setAttribute("page", name);
    console.log("loaded page", page, this.nav);
    this.content.replaceChildren(page);
    this.nav.active(ctx.pathname);

    // this.content.innerHTML = `<${name}-page></${name}-page>`;
  }
  define_routes() {
    for (const [path, props] of Object.entries(routes)) {
      // console.log(`${key}: ${value}`);
      if (props.redirect) {
        router(path, props.redirect);
        continue;
      }
      router(path, (ctx, next) => {
        ctx.route = props;
        this.load_page(props.class, ctx);
      });
    }
  }

  title_change(ev) {
    if (ev.detail?.name) this.projectname = ev.detail?.name;
    else this.page = ev.detail;

    window.document.title = `${this.projectname} | ${this.page}`;
  }
}

customElements.define("pi-app", App);
