import PageElement from "../lib/page_element.js";

let team = null;

export default class About extends PageElement {
  get title() {
    return "About Us";
  }

  async init() {
    this.slider = this.querySelector("pi-slide");
    if (!team) {
      let res = await fetch("https://randomuser.me/api/?results=12");
      let data = await res.json();
      team = data.results;
    }
    this.slider.items(team);
  }
}

window.customElements.define("about-page", About);
