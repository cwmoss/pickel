let html = `
<div id="menu"><nav></nav></div>
`

export default class SuggestMenu extends HTMLElement {

    cb = null
    selectedIndex = 0

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
        this.popup = this.querySelector("#menu nav");
        this.render()
        this.addEventListener("click", this);
        window.addEventListener("keydown", this);
        // this.popup.showPopover()
    }

    disconnectedCallback() {
        window.removeEventListener("keydown", this);
    }

    handleEvent(ev) {
        console.log("evt", ev);
        let el = ev.target // ev.composedPath()[0];
        if (ev.type == "keydown") {
            console.log("item keydown", ev.key, el);
            return this.onKeyDown(ev);
        }
        if (el.matches(".item")) {
            this.selectedIndex = el.dataset.id
            let item = this._items[this.selectedIndex]
            console.log("item clicked", item, el.innerHTML);
            // this.cb(el.innerHTML);
            // this.sprops.command({ id: el.innerHTML })

            this.dispatchEvent(new CustomEvent("s-select", { detail: item }))
        }
    }

    onKeyDown(event) {
        if (event.key === 'ArrowUp') {
            this.upHandler()
            event.preventDefault();
            return true
        }

        if (event.key === 'ArrowDown') {
            this.downHandler()
            event.preventDefault();
            // event.stopPropagation()
            // return false;
            return true
        }

        if (event.key === 'Enter') {
            this.enterHandler()
            event.preventDefault();
            return true
        }

        return false
    }

    upHandler() {
        this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
        this.update_selected()
    }

    downHandler() {
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length
        this.update_selected()
    }

    enterHandler() {
        this.selectItem(this.selectedIndex)
    }

    selectItem(index) {
        const item = this.items[index]

        if (item) {
            // this.command({ id: item })
            console.log("selected via ENTER", item);
            this.dispatchEvent(new CustomEvent("s-select", { detail: item }))
        }
    }

    _items = [];
    set items(items) {
        console.log("set sugggest items", items)
        this._items = items;
        this.selectedIndex = 0
        if (this.popup) this.render()
    }

    get items() {
        return this._items;
    }

    update_selected() {
        let sel = this.popup.querySelector(".selected");
        if (sel) sel.classList.remove("selected");
        sel = this.popup.querySelector(`button:nth-child(${this.selectedIndex + 1})`);
        if (sel) {
            sel.classList.add("selected");
            sel.focus()
        }
    }
    render() {
        this.popup.innerHTML = "";
        this._items.forEach((it, key) => {
            let ihtml = `<button data-id="${key}" class="item ${this.selectedIndex == key ? "selected" : ""}">${it.id}</button>`
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
