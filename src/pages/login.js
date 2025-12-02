import PageElement from "../lib/page_element.js";
import "../auth/login.js";

export default class Login extends PageElement { }

customElements.define("login-page", Login);
