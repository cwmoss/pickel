import PageElement from "../lib/page_element.js";

export default class Dashboard extends PageElement {
  get title() {
    return "Dashboarf";
  }
}

window.customElements.define("dashboard-page", Dashboard);
