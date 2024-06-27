import { LitElement, css, html } from "../../vendor/lit-core.min.js";

export default class Menu extends LitElement {
  static properties = {
    items: { type: Array },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
        --menu-pos-top: 0;
        --menu-pos-left: 0;
      }
      #rel {
        position: relative;
      }

      #toggle {
        /* anchor-name: --menu; */
      }

      #menu {
        position: absolute;
        border: none;
        --shadow-linie-color: rgba(114, 120, 146, 0.3);
        --shadow-schatten-color: rgba(114, 120, 146, 0.1);
        --shadow-halbschatten-color: rgba(114, 120, 146, 0.07);
        --shadow-umgebung-color: rgba(114, 120, 146, 0.06);
        border-radius: 0.375rem;
        box-shadow: 0 0 0 0.03125rem var(--shadow-linie-color),
          0 0.4375rem 0.5rem -0.25rem var(--shadow-schatten-color),
          0 0.75rem 1.0625rem 0.125rem var(--shadow-halbschatten-color),
          0 0.3125rem 1.375rem 0.25rem var(--shadow-umgebung-color);
      }
      :popover-open {
        width: 300px;
        /* height: 200px; */
        position: absolute;
        inset: unset;
        top: var(--menu-pos-top);
        left: var(--menu-pos-left);
        margin: 0;
      }
      .listcontainer,
      .subcontainer {
        display: flex;
        flex-direction: column;
      }

      a {
        flex: 1;
        text-decoration: none;
        outline: none;
        line-height: 3;
        color: black;
        padding: 0 1rem;
      }

      a:link,
      a:visited {
        color: black;
      }

      a:hover,
      a:focus {
        background: var(--color-accent);
      }

      a:active {
        background: #999;
        /* color: white; */
      }
    `,
  ];

  select(e) {
    e.preventDefault();
    console.log("selected", e.target);
    this.shadowRoot.getElementById("menu").hidePopover();
    let evt = new CustomEvent("menu-select", {
      detail: { item: e.target.getAttribute("href") },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }
  set_position() {
    let rel = this.shadowRoot.getElementById("rel");
    let toggle = this.shadowRoot.getElementById("toggle");
    let menu = this.shadowRoot.getElementById("menu");
    let top = rel.offsetHeight + rel.offsetTop + 8;
    let left = rel.offsetLeft - 300;
    this.style.setProperty("--menu-pos-top", "" + top + "px");
    this.style.setProperty("--menu-pos-left", "" + left + "px");
    console.log("set pos", rel, toggle, menu); // querySelector("#toggle"));
    menu.showPopover();
  }
  active = false;
  toggle() {}
  render() {
    return html`<div id="rel">
      <slot @click=${this.set_position}>
        <button id="toggle" class="actions">Open</button>
      </slot>
      <div id="menu" popover @click=${this.select}>
        <nav class="listcontainer">
          ${this.items.map((it) => {
            return html`<a href=${it.name}>${it.title}</a>`;
          })}
        </nav>
      </div>
    </div>`;
  }
}

window.customElements.define("pi-menu", Menu);

/*
<a href="home">Home</a>
          <div class="subcontainer" tabindex="0">
            <a href="#">Pizza <strong>></strong></a>
            <div id="subpopover" popover>
              <div class="listcontainer">
                <a href="#">Margherita</a>
                <a href="#">Pepperoni</a>
                <a href="#">Ham & Shroom</a>
                <a href="#">Vegan</a>
              </div>
            </div>
          </div>
          <a href="music">Music</a>
          <a href="wombats">Wombats</a>
          <a href="finland">Finland</a>
          */
