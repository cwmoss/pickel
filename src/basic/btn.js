import {
  LitElement,
  css,
  html,
  svg,
  nothing,
} from "../../vendor/lit-core.min.js";

const icons = {
  dots: svg`<svg width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>`,
  dotsv: svg`<svg width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
</svg>`,
  info: svg`<svg width="16" height="16" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>`,
};

export default class Button extends LitElement {
  static properties = {
    primary: { type: Boolean },
    flat: { type: Boolean },
    active: { type: Boolean, reflect: true },
    stretch: { type: Boolean, reflect: true },
    icon: {},
    title: {},
    ariaLabel: {},
    size: {},
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: content;
      }
      button {
        background: white;
        border-radius: 5px;
        border: 2px solid black;
        box-sizing: border-box;
        background-color: white;
        text-decoration: none;
        text-align: center;

        /* font-family: Helvetica;
  padding: 0.375em 0.5em 0.1875em;
  */
        padding: 0.375em 0.5em 0.4em;
        font-weight: 600;
        line-height: 1;
        height: fit-content;
      }

      button[primary] {
        background: var(--color-accent);
      }
      button[primary]:hover {
        background: color-mix(
          in lch shorter hue,
          var(--color-accent) 80%,
          white
        );
      }
      button[flat] {
        appearance: none;
        border: 0px;
      }
      button:hover,
      :host([active]) button {
        background: #eee;
      }
    `,
  ];

  // @click=${this.close}
  render() {
    return html`<button
      ?flat=${this.flat}
      ?primary=${this.primary}
      aria-label="${this.ariaLabel || nothing}"
      title="${this.title || nothing}"
      style="${this.stretch ? "height:100%" : nothing}"
    >
      <slot>${this.icon ? icons[this.icon] : ""}</slot>
    </button>`;
  }
}

window.customElements.define("pi-btn", Button);
