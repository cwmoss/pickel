import { css, html } from "./../vendor/lit-core.min.js";

import Card from "./card.js";

export default class DatasetInfo extends Card {
  url = "http://localhost:10245/data/info/movies";
  _title = "Dataset Info";

  get title() {
    return (
      this._title +
      " " +
      this.data?.dataset.name +
      " " +
      this.data?.dataset.hsize
    );
  }

  render_body() {
    return html`<pi-dl
      .keys=${["_type", "total"]}
      .data=${this.data?.document_types}
    ></pi-dl>`;
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

window.customElements.define("dataset-info", DatasetInfo);
