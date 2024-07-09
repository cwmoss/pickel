import { LitElement, css, html, unsafeHTML } from "../../vendor/lit-all.min.js";
import FormInput from "../form-elements/input.js";
import Select from "../form-elements/select.js";
import api from "../lib/slow-hand.js";

let style = css`
  #rel {
    position: relative;
  }
  pi-select {
    width: 40%;
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
    width: 50vw;
    position: absolute;
    inset: unset;
    top: var(--menu-pos-top);
    left: var(--menu-pos-left);
    margin: 0;
  }
  #menu > * {
    margin: 4px;
    padding: 0.5rem;
  }
  #menu > *:hover {
    background-color: #eee;
  }
  #menu em {
    color: #666;
    text-transform: uppercase;
    font-style: normal;
  }
`;

export default class Search extends LitElement {
  static properties = {
    id: { reflect: true },
    type: {},
    types: { type: Array },
    result: { type: Array },
  };

  static styles = [style];
  async connectedCallback() {
    super.connectedCallback();
    let schema = await api.current_schema();
    this.types = schema.document_types;
  }
  open() {
    this.dispatchEvent(
      new CustomEvent("open-doc", {
        detail: { id: this.id },
        bubbles: 1,
        composed: 1,
      })
    );
  }
  set_position() {
    let rel = this.shadowRoot.getElementById("rel");
    let toggle = this.shadowRoot.getElementById("toggle");
    let menu = this.shadowRoot.getElementById("menu");
    let top = rel.offsetHeight + rel.offsetTop + 8;
    let left = rel.offsetLeft - 300;
    this.style.setProperty("--menu-pos-top", "" + top + "px");
    this.style.setProperty("--menu-pos-left", "" + left + "px");
    menu.showPopover();
  }
  select(e) {
    let idx = e.target.dataset.idx;
    if (this.result[idx]) {
      this.dispatchEvent(
        new CustomEvent("open-doc", {
          detail: { id: this.result[idx]._id, type: this.result[idx]._type },
          bubbles: 1,
          composed: 1,
        })
      );
    }
  }
  async typeing(e) {
    let res = await api.search(e.target.value);
    this.result = res.result;
    let menu = this.shadowRoot.getElementById("menu");
    menu.showPopover();
  }
  render() {
    return html`<div id="rel">
      <form-input
        plain
        @input=${this.typeing}
        no-label
        .input_type=${"search"}
        decostart="search"
        ><pi-select
          plain
          end
          slot="suffix-button"
          class="input-group-text"
          .items=${["Type", ...(this.types ?? [])]}
        ></pi-select
      ></form-input>
      <div id="menu" popover @click=${this.select}>
        ${this?.result?.map((el, idx) => {
          return html`<div data-idx=${idx}>
            ${unsafeHTML(el.body)}<br /><em>${el._type}</em>
          </div>`;
        })}
      </div>
    </div>`;
  }
}

customElements.define("pi-search", Search);
