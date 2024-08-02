import PageElement from "../lib/page_element.js";
import DeployWidget from "../widgets/deploy.js";

export default class Dashboard extends PageElement {
  get title() {
    return "Dashboard";
  }
}

window.customElements.define("dashboard-page", Dashboard);
