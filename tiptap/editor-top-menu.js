import { LitElement, css, html } from "../vendor/lit-core.min.js";

function new_item(command, title) {
    return {
        command,
        title,
    };
}

export default class EditorTopMenu extends LitElement {
    static properties = {
        items: { type: Array },
        trigger: { type: Object },
    };

    static styles = [
        // cssvars,
        css``];

    do_action(ev) {
        let detail = { action: ev.target.name };
        this.dispatchEvent(new CustomEvent("do-action", { detail, bubbles: true, composed: true }));
    }

    render() {
        return html`
        <h3>test block editor</h3>
        <button name="save" @click=${this.do_action}>Save</button>
        <button name="bold" @click=${this.do_action}>Bold</button>
        <button name="_cblock" @click=${this.do_action}>Custom Block</button>
        <button name="_bubble" @click=${this.do_action}>menu</button>
    `
    }

}

customElements.define("editor-top-menu", EditorTopMenu);
