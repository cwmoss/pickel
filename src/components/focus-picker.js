import {
  LitElement,
  css,
  html,
  svg,
  map,
  range,
} from "../vendor/lit-all.min.js";

const retina = svg`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
<g fill="none" fill-rule="evenodd">
  <circle id="a" cx="10" cy="10" r="10" fill="#000" fill-opacity=".3" />
  <circle cx="10" cy="10" r="9" stroke="#FFF" stroke-opacity=".8" stroke-width="2"/>
</g>
</svg>`;

export default class FocusPicker extends LitElement {
  static properties = {
    img: {},
    x: { type: Number },
    y: { type: Number },
    px: {},
    py: {},
    isDragging: { type: Boolean },
  };

  static styles = [
    // cssvars,
    css`
      :host {
        display: block;
        --position-x: 70%;
        --position-y: 100%;
      }
      .grid {
        display: grid;
        grid-template-columns: 6fr 3fr 2fr;
        grid-template-rows: 6fr 3fr 2fr;
        grid-gap: 5px;

        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        /* needed for safari */
        height: 100%;
      }
      .grid img {
        object-fit: cover;
        object-position: left var(--position-x, 50%) top var(--position-y, 50%);
        height: 100%;
        width: 100%;
      }

      .picker {
        position: absolute;
        top: 30px;
        left: 30px;
        padding: 15px;
        width: 300px;

        background-color: ghostwhite;
        border-radius: 4px;
      }
      .container {
        position: relative;
        overflow: hidden;
      }
      #picker-img {
        display: block;
        max-width: 100%;
        touch-action: none;
      }
      .picker .retina {
        position: absolute;
        cursor: move;
        transform: translate(-50%, -50%);
      }
    `,
  ];

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
  }

  get container() {
    return this.renderRoot?.querySelector(".container") ?? null;
  }
  get image() {
    return this.renderRoot?.querySelector("#picker-img") ?? null;
  }
  get retina() {
    return this.renderRoot?.querySelector(".retina") ?? null;
  }
  set_focus(x, y) {
    this.x = x;
    this.y = y;
    this.px = (this.x / 2 + 0.5).toFixed(2) * 100;
    this.py = (1 - (this.y / 2 + 0.5)).toFixed(2) * 100;
    // console.log("++ set focus", px, py, x, y);
    this.style.setProperty("--position-x", "" + this.px + "%");
    this.style.setProperty("--position-y", "" + this.py + "%");
    console.log("3.bild", this.renderRoot.querySelector(".grid :nth-child(3)"));
    // this.img.setAttribute("data-focus-x", focus.x.toString());
    // this.img.setAttribute("data-focus-y", focus.y.toString());
    this.updateRetinaPositionFromFocus();
    // this.options.onChange(focus);
  }
  calculateOffsetFromFocus() {
    console.log("calculate offset", this.image);
    const { width, height } = this.image.getBoundingClientRect();
    const offsetX = width * (this.x / 2 + 0.5);
    const offsetY = height * (this.y / -2 + 0.5);
    return { offsetX, offsetY };
  }

  updateRetinaPositionFromFocus() {
    let focus = this.calculateOffsetFromFocus();
    this.updateRetinaPosition(focus.offsetX, focus.offsetY);
  }

  updateRetinaPosition(offsetx, offsety) {
    console.log("+++ update RETINA", this.retina, offsetx, offsety);
    this.retina.style.top = `${offsety}px`;
    this.retina.style.left = `${offsetx}px`;
  }

  updateCoordinates(clientX, clientY) {
    if (!this.isDragging) return; // bail if not dragging
    const { width, height, left, top } = this.image.getBoundingClientRect();

    // Calculate FocusPoint coordinates
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    const x = (offsetX / width - 0.5) * 2;
    const y = (offsetY / height - 0.5) * -2;

    console.log("++ coordinaten", clientX, clientY, x, y, {
      width,
      height,
      left,
      top,
    });

    // TODO: Figure out an elegant way to use the setFocus API without
    // having to recalculate the offset from focus
    this.set_focus(x, y);
  }

  startDragging(e) {
    e.preventDefault();
    this.isDragging = true;
    e instanceof MouseEvent
      ? this.updateCoordinates(e.clientX, e.clientY)
      : this.updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
  }

  handleMove(e) {
    e.preventDefault();
    if (e instanceof MouseEvent) {
      this.updateCoordinates(e.clientX, e.clientY);
    } else {
      const touch = e.touches[0];
      const touchedEl = document.elementFromPoint(touch.pageX, touch.pageY);
      touchedEl !== this.retina && touchedEl !== this.img
        ? this.stopDragging()
        : this.updateCoordinates(touch.clientX, touch.clientY);
    }
  }

  stopDragging() {
    this.isDragging = false;
  }

  render_picker() {
    return html`<div class="picker">
      <h3 class="instruction">Drag to select focus</h3>
      <div
        class="container"
        @mousedown=${this.startDragging}
        @mousemove=${this.handleMove}
        @mouseup=${this.stopDragging}
        @mouseleave=${this.stopDragging}
        @touchend=${this.stopDragging}
        @touchstart=${this.startDragging}
        @touchmove=${this.handleMove}
      >
        <img id="picker-img" src="${this.img}" alt="" />
        <div class="retina">${retina}</div>
      </div>
      <output
        >x: ${this.x}<br />y: ${this.y}<br />
        x%: ${this.px}<br />y%: ${this.py}
      </output>
    </div>`;
  }
  render() {
    console.log("rendering FOCUSPICKER");
    return html`<div class="grid">
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
        <img src="${this.img}" alt="" />
      </div>
      ${this.render_picker()} `;
  }
}

window.customElements.define("focus-picker", FocusPicker);
