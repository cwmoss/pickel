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
        css`
        section {
            display: flex;
            background-color: #f4f4f5;
            gap: 0.2rem;
            border-radius:4px;
            padding:.4rem;
        }
        button {
            background-color: transparent;
            border:none;
            padding:0.5rem;
            border-radius:0.75rem;
            &:hover{
                background-color:#eaeaea;
            }
        }
        .separator{
            width: 1px;
            height: 2rem;
            background-color:rgba(37, 39, 45, 0.2);
            flex-shrink:0;
        }
        `,
    ];

    do_action(ev) {
        let detail = { action: ev.target.name };
        this.dispatchEvent(
            new CustomEvent("do-action", {
                detail,
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`
            <h3>test block editor</h3>
            <section>
            <button name="save" @click=${this.do_action}>Save</button>
            <button name="save_md" @click=${this.do_action}>Save MD</button>
            <div class="separator"></div>
            <button name="bold" @click=${this.do_action}>Bold</button>
            <button name="_cblock" @click=${this.do_action}>
                Custom Block
            </button>
            <div class="separator"></div>
            <button name="_bubble" @click=${this.do_action}>menu</button>
            </section>
        `;
    }
}

customElements.define("editor-top-menu", EditorTopMenu);
