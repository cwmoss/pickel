let loaded = false;

let tpl = `
<article class="toast newest" popover="manual">
</article>`;
let style = `
article.toast{
    border:0;
    /*border-radius:3px;
    box-shadow: 3px 3px 6px #999;*/
    padding:1rem;
    --card-shadow-outline-color: rgba(114,120,146,0.3);
  --card-shadow-umbra-color: rgba(114,120,146,0.1);
  --card-shadow-penumbra-color: rgba(114,120,146,0.07);
  --card-shadow-ambient-color: rgba(114,120,146,0.06);
    border-radius: 0.375rem;
  box-shadow: 0 0 0 0.03125rem var(--card-shadow-outline-color),
  0 0.4375rem 0.5rem -0.25rem var(--card-shadow-umbra-color),
  0 0.75rem 1.0625rem 0.125rem var(--card-shadow-penumbra-color),
  0 0.3125rem 1.375rem 0.25rem var(--card-shadow-ambient-color);
}
article.toast.fail {
  background-color: oklch(0.7176 0.221 22.18);
  color:black;
}

article.toast.ok {
  background: rgb(50, 255, 50);
}

:popover-open {
  position: fixed;
  inset: unset;
  right: 1rem;
  top: var(--toast-bottom-position, -16px);
  transition: top 0.1s ease-in;
}
`;
export default class Toast extends HTMLElement {
  popover = null;
  connectedCallback() {
    if (!loaded) {
      loaded = true;
      let tag = document.createElement("style");
      tag.appendChild(document.createTextNode(style));
      document.getElementsByTagName("head")[0].appendChild(tag);
    }
    this._type = this.getAttribute("type");
    this._msg = this.getAttribute("msg");
    this.innerHTML = tpl;
    this.popover = this.querySelector("article");
    this.popover.classList.add(this._type || "info");
    this.popover.textContent = this._msg;
    this.popover.showPopover();
    let height = this.popover.offsetHeight;
    console.log("new", this.popover);
    setTimeout(() => {
      this.popover.hidePopover();
      this.remove();
    }, 4000);

    // When a new toast appears, run the movetoastsUp() function
    this.popover.addEventListener("toggle", (event) => {
      if (event.newState === "open") {
        this.moveToastsUp(height);
      }
    });
  }

  moveToastsUp(height) {
    console.log("move up", height);

    document.querySelectorAll("pi-toast .toast").forEach((toast) => {
      // If the toast is the one that has just appeared, we don't want it to move up.
      if (toast.classList.contains("newest")) {
        toast.style.setProperty("--toast-bottom-position", "16px");
        toast.classList.remove("newest");
      } else {
        // Move up all the other toasts by 50px to make way for the new one
        const prevValue = toast.style
          .getPropertyValue("--toast-bottom-position")
          .replace("px", "");
        const newValue = parseInt(prevValue) + height + 8;
        toast.style.setProperty("--toast-bottom-position", `${newValue}px`);
      }
    });
  }
}

customElements.define("pi-toast", Toast);

export const toast_alert = (msg) => {
  let t = new Toast();
  t.setAttribute("type", "fail");
  t.setAttribute("msg", msg);
  document.body.appendChild(t);
};
