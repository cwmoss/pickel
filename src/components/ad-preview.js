export default class AdPreview extends HTMLElement {
  connectedCallback() {
    this.base = this.getAttribute("baseurl");
    this.data = JSON.parse(this.getAttribute("ad"));
    this.render();
    document.addEventListener("formdata", (e) => {
      console.log("++ preview sees formadata", e.formData);
      this.data = Object.fromEntries(e.formData);
      this.render();
    });
  }

  render() {
    if (this.data?.type == "text") {
      this.querySelector("[type=bild]").setAttribute("hidden", "");
      this.querySelector("[type=text]").removeAttribute("hidden");
      this.querySelector("[alt]").innerHTML = this.data?.alt;
      this.querySelector("[type=text] a").innerHTML = this.data?.button;
    } else {
      let img = this.querySelector("img");
      this.querySelector("[type=text]").setAttribute("hidden", "");
      this.querySelector("[type=bild]").removeAttribute("hidden");
      if (!this.data?.image_url) {
        this.querySelector(".placeholder").removeAttribute("hidden");
      } else {
        this.querySelector(".placeholder").addAttribute("hidden", "");
        img.setAttribute("src", this.base + this.data.image_url);
        img.setAttribute("alt", this.data?.alt);
        img.setAttribute("title", this.data?.alt);
      }
    }
    this.querySelectorAll("[href]").forEach((el) =>
      el.setAttribute("href", this.data.url)
    );
  }
}
