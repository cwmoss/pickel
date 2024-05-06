export default class Navigation extends HTMLElement {
  connectedCallback() {
    let hili = this.getAttribute("active");
  }

  active(path) {
    this.querySelectorAll("a").forEach((el) => {
      console.log("active?", el);
      if (el.getAttribute("href") == path) {
        el.parentElement.classList.add("active");
      } else {
        el.parentElement.classList.remove("active");
      }
    });
  }
}
