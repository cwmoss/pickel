import { LitElement, css, html } from "./src/vendor/lit-core.min.js";

class Header extends LitElement {
  static properties = {
    data: {
      type: Array,
    },
  };

  render_placeholder() {
    return html`<p>...</p>
      <p>...</p>`;
  }

  render() {
    return html` <h3>names:</h3>
      ${this.data
        ? html` ${this.data.map((e) => {
            return html`<p>${e}</p>`;
          })}`
        : this.render_placeholder()}`;
  }
}
customElements.define("pi-header", Header);

class Widget extends LitElement {
  static properties = {
    title: {},
    data: {
      type: Object,
    },
  };
  render() {
    return html`<h1>${this.title}</h1>
      <slot></slot>`;
  }
}
customElements.define("pi-widget", Widget);

class Fetcher extends LitElement {
  static properties = {
    title: {},
    data: {
      type: Object,
    },
  };
  async connectedCallback() {
    super.connectedCallback();
    this.data = await this.dofetch();
    this.handleSlotchange();
  }
  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector("slot");
    return slot.assignedElements({
      flatten: false,
    });
  }
  handleSlotchange() {
    this._slottedChildren.forEach((element) => {
      element.data = this.data;
    });
  }
  async dofetch() {
    await this.timeout(1000);
    return ["harry", "ewald", "Mimmi"];
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  render() {
    let data = false;
    if (this.data) data = true;
    return html`<slot ?hasdata=${data} @slotchange=${this.handleSlotchange}>
    </slot>`;
  }
}
customElements.define("pi-fetcher", Fetcher);

// html`<p>${e}</p>`
