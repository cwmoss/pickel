import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";
import Face from "./face.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../../lib/util.js";

/*
https://stackoverflow.com/questions/63710162/how-to-load-font-face-in-dynamically-loaded-styles-of-web-component-with-shadow
https://github.com/Ionaru/easy-markdown-editor/issues/491
https://stackoverflow.com/questions/54546007/why-doesnt-font-awesome-work-in-my-shadow-dom

https://github.com/Ionaru/easy-markdown-editor?tab=readme-ov-file#toolbar-icons
*/
let style = css`
  #map {
    height: 220px;
  }
  label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: inline-block;
  }
`;

export default class Geo extends Face {
  static properties = { ...Face.properties, prefix: {}, suffix: {} };
  static styles = [style];
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.init(), 100);
  }

  init() {
    this.el = this.shadowRoot.querySelector("div");
    this.map = L.map(this.el).setView(this.latlong, 13); // [51.505, -0.09]
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }
  get latlong() {
    let latlong = this.value;
    console.log("++ latlong ++", latlong);
    return L.latLng(latlong.lat, latlong.lng);
  }
  get_updated_data() {
    // TODO: warum wird das frühzeitig aufgerufen?
    return {};
  }

  update_input(e) {
    console.log("+++ update", hashID(5), e, e.target.value);
    this.value.current = e.target.value;
  }
  render() {
    console.log("render text");
    return html`<link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
      />
      <label for="input" class="form-label">${this.label}</label>
      <div id="map"></div>`;
  }
}

customElements.define("pi-geo", Geo);
