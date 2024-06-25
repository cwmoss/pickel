/*

https://dev.to/deepakdevanand/pulse-css-animation-43h
https://codepen.io/deepakdevanand/pen/qBKbpPV

https://codepen.io/saigowthamr/pen/PowdZqy
*/
let loaded = false;
const style = `
  @keyframes pulse-animation {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
    }
  }
  bob-charcount .info.pulse {
    animation: pulse-animation 2s infinite;
}
`;
export default class CharCount extends HTMLElement {
  html = "<span aria-live=”polite”></span>";

  connectedCallback() {
    this.max = this.getAttribute("max");
    let display = this.querySelector(".info");
    // display.innerHTML = this.html;
    display.setAttribute("aria-live", "polite");
    this.info = display;
    // this.info = this.querySelector(".info span");
    let html = `
      <style>${style}</style>
    `;
    this.append_html(html);
    let text = this.getAttribute("text");
    this.textfun = (n) => text.replace("{n}", n);

    this.el = this.querySelector("textarea");
    // this.el = el;

    console.log("words: ", this.max, this, this.el, this.display);
    this.on_input();
    this.el.addEventListener("input", this.on_input);
  }

  on_input = (e) => {
    let len = this._count_chars(this.el.value);
    let remain = this.max - len;
    if (len > this.max) {
      this.el.value = this.el.value.substring(0, this.max);
      remain = 0;
    }
    if (remain <= 0) this.info.classList.add("pulse");
    else this.info.classList.remove("pulse");
    this.info.textContent = this.textfun(remain < 0 ? 0 : remain);
  };

  _count_chars(text) {
    return text.length;
    // let count = this.el.value.split(/\s+/g).filter((e) => e != "").length;
    // return count;
  }

  append_html(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    const temp = document.importNode(template.content, true);

    this.appendChild(temp);
  }
}
