/*
https://codesandbox.io/p/sandbox/floating-ui-dom-composed-offset-position-iscontainingblock-repro-case-qgfhnx?file=%2Fsrc%2Findex.js%3A96%2C37-96%2C60
*/
// import loaded from "./floating-ui/loader.js";
// import { offsetParent } from "./floating-ui/composed-offset-position.js";
import { LitElement, css, html } from "../vendor/lit-core.min.js";
import { computePosition, flip, shift } from "../vendor/floating-ui-bundle.js";

function new_item(command, title) {
    return {
        command,
        title,
    };
}

export default class BubbleMenu extends LitElement {
    static properties = {
        items: { type: Array },
        trigger: { type: Object },
    };

    static styles = [
        // cssvars,
        css`
            :host {
                // display: block;
                position: relative;
                --menu-pos-top: 0;
                --menu-pos-left: 0;
            }
            #rel {
                // position: relative;
            }

            #toggle {
                /* anchor-name: --menu; */
            }

            #menu {
                position: absolute;
                inline-size: max-content;
                // display: none;
                border: none;
                background-color: white;
                --shadow-linie-color: rgba(114, 120, 146, 0.3);
                --shadow-schatten-color: rgba(114, 120, 146, 0.1);
                --shadow-halbschatten-color: rgba(114, 120, 146, 0.07);
                --shadow-umgebung-color: rgba(114, 120, 146, 0.06);
                border-radius: 0.75rem;
                box-shadow:
                    0 0 0 0.03125rem var(--shadow-linie-color),
                    0 0.4375rem 0.5rem -0.25rem var(--shadow-schatten-color),
                    0 0.75rem 1.0625rem 0.125rem
                        var(--shadow-halbschatten-color),
                    0 0.3125rem 1.375rem 0.25rem var(--shadow-umgebung-color);
            }
            :popover-open {
                width: max-content;
                /* height: 200px; */
                position: absolute;
                inset: unset;
                top: var(--menu-pos-top);
                left: var(--menu-pos-left);
                margin: 0;
            }
            .listcontainer,
            .subcontainer {
                display: flex;
                flex-direction: row;
            }

            button {
                flex: 1;
                text-decoration: none;
                outline: none;
                line-height: 3;
                color: black;
                padding: 0 0.5rem;
                border-radius: 0.75rem;
                background: #fff;
                border: transparent;
            }

            button:hover,
            button:focus {
                background: var(--color-accent);
            }

            button:active {
                background: #999;
                /* color: white; */
            }
            .tooltip[popover] {
                background: #007bff;
                color: #fff;
            }

            .tooltip[popover] {
                left: calc(anchor(right) + 2px);
                top: anchor(center);
                transform: translateY(-50%);
            }
            button:hover + .tooltip {
                visibility: visible;
            }
        `,
    ];

    connectedCallback() {
        this.init_items();
        super.connectedCallback();
    }

    init_items() {
        if (!this.items) this.items = [];
        this.items.push(new_item("setBold", "bold"));
        this.items.push(new_item("setItalic", "italic"));
    }

    select(e) {
        e.preventDefault();
        console.log("++++ selected", e.target);
        this.shadowRoot.getElementById("menu").hidePopover();
        let evt = new CustomEvent("menu-select", {
            detail: { item: e.target.getAttribute("href") },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(evt);
    }
    exec(e) {
        console.log("++exit", e.target);
    }
    enter(e) {
        let popover = e.target.querySelector("[popover]");
        console.log("++enter", e.target, popover);
        if (popover) popover.showPopover();
    }
    leave(e) {
        let popover = e.target.querySelector("[popover]");
        if (popover) popover.hidePopover();
    }
    show(trigger) {
        console.log("++ show ++", trigger, trigger.getBoundingClientRect());
        let t = trigger;

        let v = {
            getBoundingClientRect() {
                return t.getBoundingClientRect();
            },
        };

        let menu = this.shadowRoot.querySelector("#menu");
        // menu.style.display = "block";
        menu.showPopover();
        computePosition(t, menu, {
            middleware: [
                flip(),
                shift({
                    padding: 5,
                }),
            ],

            /* platform: {
              ...window.FloatingUIDOM.platform,
              getOffsetParent: (element) =>
                window.FloatingUIDOM.platform.getOffsetParent(element, offsetParent),
            }, */
        }).then(({ x, y }) => {
            console.log("computed:", x, y);

            this.style.setProperty("--menu-pos-left", "" + x + "px");
            this.style.setProperty("--menu-pos-top", "" + y + "px");
            /*
            Object.assign(menu.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
            */
            // menu.showPopover();
        });
    }
    active = false;
    toggle() {}
    render() {
        return html`<div id="menu" popover @click=${this.select}>
            <nav class="listcontainer">
                ${this.items.map((it) => {
                    return html`<button
                        id=${it.command}
                        popovertarget="${it.command}_info"
                        @click=${this.exec}
                        @mouseenter=${this.enter}
                        @mouseleave=${this.leave}
                    >
                        ${it.title}
                        <div
                            role="tooltip
                            id="${it.command}_info"
                            popover="manual"
                            anchor="${it.command}"
                            class="tooltip left"
                        >
                            Lorem ipsum dolor sit amet
                        </div>
                    </button>`;
                })}
            </nav>
        </div>`;
    }
}

customElements.define("bubble-menu", BubbleMenu);
