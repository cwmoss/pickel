const template = document.createElement("template");

template.innerHTML = `
<style>
:host *{
  box-sizing: border-box;
}
</style>

<a href="javascript:;">Logout</a>
`;

export default class Logout extends HTMLElement {
    endpoint = "/auth";

    constructor() {
        super();
        this.attachShadow({
            mode: "open",
        });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("a").addEventListener("click", (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    connectedCallback() {
        // this.change_mode(true);
    }

    async logout() {
        // console.log("submit+++", this);

        let path = "/logout";

        let resp = await fetch(`${this.endpoint}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": this.csrf_token(),
            },
            credentials: "include",
            // body: JSON.stringify(args),
        });
        let data = await resp.json();
        if (data.ok == false) {
            // this.alert.removeAttribute("hidden");
            // this.message.innerHTML = "Login fehlgeschlagen";
        } else {
            let ev = new CustomEvent("logout-successful", {
                detail: data,
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(ev);
        }
    }

    csrf_token() {
        return "TODO";
    }
}

customElements.define("app-logout", Logout);
