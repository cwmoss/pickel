import { html, css, LitElement } from "../../vendor/lit-core.min.js";

export default class Profile extends LitElement {

    static styles = [
        // cssvars,
        css`
      :host {
        display: grid;
        --size: 30px;
        
        width: var(--size);
        height: var(--size);
        border-radius:50%;
        background-color: silver;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-image: var(--avatar-image);
        color:white;
        place-items:center;
      }
      a {
        font-size:1.5rem;
        font-weight:900;
        display:block;
        width:100%;
        height:100%;
        text-align:center;
        background-color:transparent;  
      }
      a {
        color: inherit;
        text-decoration:none;
      }
    `];

    static properties = {
        profile: { type: Object },
    };

    // --avatar-image: url("http://localhost:10245/images/movies/04c7944b63e3df454a11906cd356d52d122cd551-185x278.jpg?size=150x150&mode=fit");
    image = "http://localhost:10245/images/movies/04c7944b63e3df454a11906cd356d52d122cd551-185x278.jpg?size=150x150&mode=fit";
    // image = ""
    loaded = false;
    initialize(profile) {
        this.loaded = true;
        this.profile = profile;
        if (this.image)
            this.style.setProperty("--avatar-image", 'url(' + this.image + ')');
    }


    // image = "";
    render() {
        console.log("++ profile widget", this.profile);
        if (!this.profile) return "";
        let name = this.profile.uname.substr(0, 1);
        if (this.image) name = "";
        // style="${this.image ? 'background-image:url(' + this.image + ')' : ''}"
        return html`
            <a href="/studio/profile" 
            title="${this.profile.uname}"
            >${name}</a>
        `;
    }
}

customElements.define("sh-profile", Profile);
