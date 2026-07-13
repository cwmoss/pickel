let html = `
<style>
:host{
    display:inline;
}
</style>
<span><slot></slot></span>
<span class="suggest-items" popover></span>
`

export default class SuggestNode extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        console.log("suggest-node connected!");
        this.shadowRoot.innerHTML = html
        this.popup = this.shadowRoot.querySelector(".suggest-items");
        this.popup.showPopover()
    }

    _items = [];
    set items(items) {
        console.log("set sugggest items", items)
        this._items = items;
        this.render()
    }

    render() {
        this.popup.innerHTML = "";
        this._items.forEach((it) => {
            let ihtml = `<span class="item">${it}</span>`
            this.popup.insertAdjacentHTML("beforeend", ihtml)
        })

    }
}

customElements.define("suggest-node", SuggestNode);
