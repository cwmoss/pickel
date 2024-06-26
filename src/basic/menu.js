import { LitElement, css, html } from "../../vendor/lit-core.min.js";

export default class Menu extends LitElement {
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
        --card-shadow-outline-color: rgba(114, 120, 146, 0.3);
        --card-shadow-umbra-color: rgba(114, 120, 146, 0.1);
        --card-shadow-penumbra-color: rgba(114, 120, 146, 0.07);
        --card-shadow-ambient-color: rgba(114, 120, 146, 0.06);
        border-radius: 0.375rem;
        box-shadow: 0 0 0 0.03125rem var(--card-shadow-outline-color),
          0 0.4375rem 0.5rem -0.25rem var(--card-shadow-umbra-color),
          0 0.75rem 1.0625rem 0.125rem var(--card-shadow-penumbra-color),
          0 0.3125rem 1.375rem 0.25rem var(--card-shadow-ambient-color);
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
  }

  render() {
    return html`<div id="rel">
      <button
        id="toggle"
        class="actions"
        popovertarget="menu"
        popovertargetaction="toggle"
        @click=${this.set_position}
      >
        select
      </button>
      <div id="menu" popover @click=${this.select}>
        <nav class="listcontainer">
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
        </nav>
      </div>
    </div>`;
  }
}

window.customElements.define("pi-menu", Menu);
