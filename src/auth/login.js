const template = document.createElement("template");
const error_svg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
const login_svg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>`;

template.innerHTML = `
<style>
:host *{
  box-sizing: border-box;
}
  
:host{
    display: block;
    background-color:white;
    padding:1em !important;
    transform:rotate(-3deg);
    box-sizing: border-box;
    box-shadow: 3px 3px 10px #ccc;
    text-align:left;
    width: 800px;
    max-width: 80vw;
    border-left: 10px solid;
    border-image: repeating-linear-gradient(43deg,
            black,
            black 4px,
            transparent 5px,
            transparent 9px,
            black 10px) 10;

}

:host([mode=login]) [no-login]{
  display:none;
}
:host([mode=reset]) [no-reset]{
  display:none;
}

input, button{
    border-radius:3px;
    border:0;
    font-size:2em;
    padding:12px;

}
input{
    border:3px solid #eee;
    background-color:white !important;
    margin-bottom:1em;
    margin-top:4px;
    width:100%;
}
:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 .25rem rgba(13,110,253,.25);
}
button{
    font-size:1.3em;
    color:black;
    /* font-weight:bold; */
    background-color:oklch(0.8329 0.2331 132.51);
    border-radius:10px;
    border:2px solid black;
    display: block;
    vertical-align: middle;
}
button svg{
    display: inline;
    margin-left: 1em;
    vertical-align: bottom;
}
button:hover{
    background-color:rgb(25, 135, 84);
    transition:all 0.5s;
}
.actions{
  display:flex;
  justify-content: space-between;
  width: 100%;
}
form{
    /*display:flex;
    flex-direction:row;
    */
  max-width:100%;
}
label, input{
    display:block;
    max-width:100%;
}
label{
    font-weight:bold;
    background-color:black;
    color:white;
    display:inline-block;
    padding:3px 6px;
}
#alert{
    background-color:tomato;
    color:white;
    padding:6px;
    border-radius:3px;
    display:flex;
    align-items: center;
    gap:1em;
    margin-bottom:1em;
    max-width:400px;
}
#alert[hidden]{
    display:none;
}
#alert svg{
    flex: none;
}
path{
    stroke:white;
    fill:white;
}
</style>
<form id="login-form">

<label for="email">E-Mail</label>
<input type="text" id="email" />

<label no-reset for="password">Passwort</label>
<input no-reset type="password" id="password" />

<div id="alert" hidden>${error_svg}<div id="message"></div></div>
<div class="actions">
<button no-reset type="submit">Login</button>
<button no-login type="submit">Passwort zurücksetzen</button>
<a href="javascript:;" class="change-mode"><span no-reset>Passwort vergessen</span><span no-login>Login</span></a>
</div>
</form>`;

export default class Login extends HTMLElement {
    endpoint = "/auth";

    constructor() {
        super();
        this.attachShadow({
            mode: "open",
        });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot
            .querySelector("form")
            .addEventListener("submit", (e) => {
                e.preventDefault();
                if (this.mode == "login") this.login();
                else this.reset_request();
            });
        this.shadowRoot
            .querySelector(".change-mode")
            .addEventListener("click", () => {
                this.change_mode();
            });
        this.alert = this.shadowRoot.getElementById("alert");
        this.message = this.shadowRoot.getElementById("message");
        // this.change_mode(true);
    }

    connectedCallback() {
        this.change_mode(true);
    }

    change_mode(init) {
        if (init) {
            this.mode = this.getAttribute("mode") || "login";
        } else {
            if (this.mode == "login") {
                this.mode = "reset";
            } else {
                this.mode = "login";
            }
        }
        this.alert.setAttribute("hidden", "");
        this.message.innerHTML = "";
        this.setAttribute("mode", this.mode);
    }
    async login() {
        // console.log("submit+++", this);
        this.alert.setAttribute("hidden", "");
        let path = "/login";
        const args = {
            email: this.shadowRoot.getElementById("email").value,
            password: this.shadowRoot.getElementById("password").value,
        };
        let resp = await fetch(`${this.endpoint}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": this.csrf_token(),
            },
            credentials: "include",
            body: JSON.stringify(args),
        });
        let data = await resp.json();
        if (data.ok == false) {
            this.alert.removeAttribute("hidden");
            this.message.innerHTML = "Login fehlgeschlagen";
        } else {
            let ev = new CustomEvent("login-successful", {
                detail: data,
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(ev);
        }
    }

    async reset_request() {
        // console.log("submit+++", this);
        this.alert.setAttribute("hidden", "");
        let path = "/request_reset";
        const args = {
            email: this.shadowRoot.getElementById("email").value,
        };
        let resp = await fetch(`${this.endpoint}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": this.csrf_token(),
            },
            credentials: "include",
            body: JSON.stringify(args),
        });
        let data = await resp.json();
        if (data.ok == false) {
            this.alert.removeAttribute("hidden");
            let msg = "";
            if (data.problems && data.problems.length) {
                msg = data.problems.map((e) => e.message).join("<br>");
            } else {
                msg = data.message ?? "Es ist ein Fehler aufgetreten.";
            }
            console.log("++ msg", msg);
            this.message.innerHTML = msg;
        } else {
            this.alert.removeAttribute("hidden");
            this.message.innerHTML = "OK, schau in dein Postfach :)";
            let ev = new CustomEvent("reset-successful", {
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

customElements.define("app-login", Login);
