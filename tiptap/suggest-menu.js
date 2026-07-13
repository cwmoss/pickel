let html = `
<div id="menu"></div>
`

export default class SuggestMenu extends HTMLElement {

    cb = null

    constructor() {
        super()
        console.log("suggest menu construct")

        // this.attachShadow({ mode: "open" });
        //this.root = this; // this.shadowRoot
        // this.innerHTML = html
        // this.popup = this.querySelector("#menu");
    }
    connectedCallback() {
        console.log("suggest-node connected!");
        this.setAttribute("popover", "manual");
        this.innerHTML = html
        this.popup = this.querySelector("#menu");
        this.render()
        this.addEventListener("click", this);
        // this.popup.showPopover()
    }

    handleEvent(ev) {
        console.log("evt", ev);
        let el = ev.target // ev.composedPath()[0];
        if (el.matches(".item")) {
            console.log("item clicked", el.innerHTML);
            this.cb(el.innerHTML);
            // this.sprops.command({ id: el.innerHTML })
            this.dispatchEvent(new CustomEvent("s-select", { detail: el.innerHTML }))
        }
    }
    _items = [];
    set items(items) {
        console.log("set sugggest items", items)
        this._items = items;
        if (this.popup) this.render()
    }

    render() {
        this.popup.innerHTML = "";
        this._items.forEach((it) => {
            let ihtml = `<div class="item">${it}</div>`
            this.popup.insertAdjacentHTML("beforeend", ihtml)
        })

    }
}

customElements.define("suggest-menu", SuggestMenu);

/*

regeln:

A

kein shadowdom (wg fokus???)
https://github.com/ueberdosis/tiptap/issues/2114

I solved that by replacing

window.getSelection().collapseToEnd()

with

// this causes invalid state exception in Safari when selecting the item via mouse-click
// it appears as if the focus leaves the editor when clicking - and then window.getSelection
// a selection object with `rangeCount` = 0 - which then leads to an invalid state error
const selection = window.getSelection();
if (selection?.rangeCount) {
  selection.collapseToEnd();
}

B

rendern erst wenn connected

*/
