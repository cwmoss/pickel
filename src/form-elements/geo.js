import { LitElement, css, html, render } from "./../../vendor/lit-core.min.js";
import Input from "./input.js";
import Face from "./face.js";
import { get_document, api } from "./_helper.js";
import { slugify, hashID } from "../lib/util.js";

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
// berlin
let geo_default = { lat: 52.518611, lng: 13.408333 };

export default class Geo extends Face {
  static properties = {
    ...Face.properties,
    prefix: {},
    suffix: {},
    marker: { type: Object },
  };
  static styles = [style];
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.init(), 100);
  }

  add_marker(latlong) {
    if (this.marker) {
      this.marker.setLatLng(latlong);
      // this.marker.addTo(this.map)
      this.value = latlong;
    } else {
      this.marker = L.marker(latlong, { draggable: true }).addTo(this.map);
      this.value = latlong;
      let content = document.createElement("div");
      let btn = html`<pi-btn
        flat
        @click=${() => {
          this.marker.remove();
          this.marker = null;
          this.value = null;
        }}
        >remove</pi-btn
      >`;
      render(btn, content);
      /*
      let btn = document.createElement("pi-btn");
      btn.flat = true;
      btn.innerHTML = "remove";
      btn.addEventListener("click", (e) => {
        console.log("$$ popup click", e);
        this.marker.remove();
        this.marker = null;
        this.value = null;
      });
      */
      let popup = this.marker.bindPopup(content).getPopup();
      // popup.addEventlistener("click", () => console.log("button clicked?"));
      this.marker.on("move", (e) => {
        console.log("move", e);
        this.value = e.latlng;
      });
    }
  }

  init() {
    this.el = this.shadowRoot.querySelector("div");
    this.map = L.map(this.el).setView(this.latlong, 13); // [51.505, -0.09]
    L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/";
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    if (this.value.lat) {
      this.add_marker(this.value);
    }

    this.map.on("click", (e) => {
      console.log("clicked to map", e);
      this.add_marker(e.latlng);
    });
  }
  get latlong() {
    let latlong = geo_default; // this.value;
    if (this.value.lat) {
      latlong = this.value;
    }
    console.log("++ latlong ++", latlong);
    return latlong;
    return L.latLng(latlong.lat, latlong.lng);
  }
  get_updated_data() {
    return this.value;
    // TODO: warum wird das frühzeitig aufgerufen?
    return {};
  }

  update_input(e) {
    console.log("+++ update", hashID(5), e, e.target.value);
    // this.value.current = e.target.value;
  }
  render() {
    // console.log("render MAP", this.value);
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
