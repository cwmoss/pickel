import PageElement from "../lib/page_element.js";

export default class Profile extends PageElement {
    get title() {
        return "Profile";
    }

    async init() {

    }
}

customElements.define("profile-page", Profile);
