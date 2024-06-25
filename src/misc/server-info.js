import { css, html } from "../../vendor/lit-core.min.js";

import Card from "./card.js";

export default class ServerInfo extends Card {
  url = "http://localhost:10245/data/info/movies";
  title = "Server Info";

  render_body() {
    return html`<pi-dl .keys=${["k", "v"]} .data=${this.data?.server}></pi-dl>`;
  }

  xrender_body() {
    if (!this.data?.server) return "";
    return html`<dl>
      ${this.data.server.map((el) => {
        return html`<dt>${el.k}</dt>
          <dd>${el.v}</dd>`;
      })}
    </dl>`;
  }
}

window.customElements.define("server-info", ServerInfo);
