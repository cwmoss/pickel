import { LitElement, css, html } from "../../vendor/lit-core.min.js";

export default class WindowDrop extends LitElement {
  static styles = css`
    .dropzone {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      display: flex;
      visibility: hidden;
      background-color: rgba(0, 0, 0, 0.3);
      align-items: center;
      justify-content: space-around;
      transition: all 0.25s ease-out;
      z-index: 100;
      color: white;
    }
    .dropzone.dragged-over {
      visibility: visible;
      width: 100vw;
      height: 100vh;
    }
    :popover-open {
      border: 1px solid #999;
      border-bottom: 0;
      /* box-shadow: 2px 2px 6px; */
      position: fixed;
      inset: unset;
      left: 1rem;
      bottom: var(--files-position, -600px);
      width: 600px;
      height: 600px;
      background-color: white;
      transition: bottom 0.4s ease-in-out;
    }
  `;
  constructor() {
    super();
    this.listeners = [
      ["dragenter", this.enter.bind(this)],
      ["dragover", this.enter.bind(this)],
      ["dragleave", this.leave.bind(this)],
      ["drop", this.drop.bind(this)],
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    let el = document.querySelector("body");
    this.listeners.forEach(([evt, fun]) => el.addEventListener(evt, fun));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("++ remove drag events");
    let el = document.querySelector("body");
    this.listeners.forEach(([evt, fun]) => el.removeEventListener(evt, fun));
  }
  drop(e) {
    console.log("++ dropped", e);
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
      console.log("drop", e.dataTransfer.files);
      const evt = new CustomEvent("files-dropped", {
        detail: { files: e.dataTransfer.files },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(evt);
      e.stopPropagation();
      // qfile.value.addFiles(evt.dataTransfer.files);
      // show_list.value = true;
    }
    document.querySelector("body").classList.remove("dragging");
    this.shadowRoot.querySelector(".dropzone").classList.remove("dragged-over");
    this.open();
  }

  enter(e) {
    e.preventDefault();
    console.log("++ drag over");
    document.querySelector("body").classList.add("dragging");
    this.shadowRoot.querySelector(".dropzone").classList.add("dragged-over");
  }

  leave() {
    console.log("++ drag leave");
    document.querySelector("body").classList.remove("dragging");
    this.shadowRoot.querySelector(".dropzone").classList.remove("dragged-over");
  }
  open() {
    this.shadowRoot.querySelector(".files-container").showPopover();
    this.shadowRoot
      .querySelector(".files-container")
      .style.setProperty("--files-position", "0");
  }
  close() {
    this.shadowRoot
      .querySelector(".files-container")
      .style.setProperty("--files-position", "-600px");
    window.setTimeout(
      () => this.shadowRoot.querySelector(".files-container").hidePopover(),
      400
    );
  }
  render() {
    return html`<div class="dropzone"></div>
      <div class="files-container" popover="manual">
        <button @click=${this.close}>close</button>
      </div>
      <multi-upload></multi-upload>`;
  }
}

customElements.define("window-drop", WindowDrop);
