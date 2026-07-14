import { LitElement, css, html } from "../vendor/lit-core.min.js";
// import { computePosition, flip, shift } from "../vendor/floating-ui-bundle.js";

export default class PlaceholderMention extends LitElement {
    static properties = {
        // items: { type: Array },
        // trigger: { type: Object },
        mention: {}
    };

    static styles = [
        // cssvars,
        css`
            :host{
                font-family:monospace;
                background-color: #eee;
            }
        `,
    ];

    render() {
        return html`<span>${this.mention}</span>`
    }
}

customElements.define("placeholder-mention", PlaceholderMention);
