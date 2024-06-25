import Splide from "../../vendor/splide.esm.js";

let loaded = false;
// <li class="splide__slide">Slide 01</li>
let tpl = `
<div class="splide" role="group" aria-label="Splide Basic HTML Example">
  <div class="splide__track">
		<ul class="splide__list">
		</ul>
  </div>
</div>`;

export default class Slide extends HTMLElement {
  connectedCallback() {
    if (!loaded) {
      var tag = document.createElement("link");
      tag.setAttribute("rel", "stylesheet");
      tag.setAttribute("href", "/src/vendor/splide.min.css");
      // tag.appendChild(document.createTextNode(styles));
      document.getElementsByTagName("head")[0].appendChild(tag);
    }
    this.innerHTML = tpl;
    this.splide = this.querySelector(".splide");
    this.list = this.querySelector(".splide__list");
  }

  items(items) {
    console.log("+++set items", items);
    items.forEach((item) => {
      let html = `<li class="splide__slide"><img src="${item.picture.medium}"></li>`;
      this.list.insertAdjacentHTML("beforeend", html);
    });
    new Splide(this.splide, {
      fixedWidth: 200,
      fixedHeight: 200,
      gap: 10,
      rewind: true,
      pagination: false,
    }).mount();
  }
}
