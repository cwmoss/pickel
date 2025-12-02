import { LitElement, css, html, classMap } from "../../vendor/lit-all.min.js";
import api from "../lib/api.js";
import project from "../lib/project.js";
import Preview from "../slowhand/preview.js";
import FormBuilder from "../form-elements/form-builder.js";

// https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
// funktioniert leider wohl nicht
let output_styles = css`
section {
  margin-top:0.5rem;
  height: 240px;
  overflow: scroll;
}
section * {
  overflow-anchor: none;
}
output {
  display:block;
  width: 350px;
  white-space: pre-wrap;
  font-family: monospace;
}
#anchor {
  overflow-anchor: auto;
  height: 1px;
}
`

const deploy = function (secrets, setOutput, cb) {
  const xhr = new XMLHttpRequest();
  console.log("+++ widget options", secrets);

  xhr.open("POST", secrets.url, true);
  xhr.setRequestHeader("x-slft-deploy", secrets.apikey);

  xhr.onprogress = function (e) {
    console.log("progress");
    console.log(e);

    var outp = e.currentTarget.responseText;
    console.log(outp);
    setOutput(outp);
  };
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // && xhr.status === 200
      cb();
    }
  };
  xhr.send();
};

export default class DeployWidget extends LitElement {
  static properties = {
    show_dialog: { state: true, type: Boolean },
    deploying: { state: true, type: Boolean },
    preferences: { state: true, type: Object },
    output: {}
  };

  static styles = [output_styles];

  docid = ".deployment";
  async connectedCallback() {
    super.connectedCallback();

    console.log("connected deploy", this.preferences);
    let doc = await api.document(this.docid);
    if (!doc) doc = { _id: this.docid, _type: "deploy" };
    this.preferences = doc;
    console.log("connected deploy", this.preferences);
  }
  async save_preferences(e) {
    let doc = e.detail;
    console.log("$ save", doc);
    await api.mutate(doc);
    this.preferences = doc;
  }

  deploy() {
    console.log("preferences", this.preferences);

    // this.output = `deploying site ${this.preferences.url}\n<span style="background-color: black; color: white">hier </span>`;
    let section = this.shadowRoot.querySelector("section")
    let output = this.shadowRoot.querySelector("output")
    output.insertAdjacentHTML('beforeend', `deploying site ${this.preferences.url}\n`)

    section.scroll(0, 1);

    // ${html`${this.output}`}

    deploy({ url: this.preferences.url, apikey: this.preferences.apikey },
      (res) => {
        // this.output += res
        // output.insertAdjacentHTML('beforeend', res)
        output.innerHTML = res
        section.scrollTop = section.scrollHeight;
      },
      () => output.insertAdjacentHTML('beforeend', "\ndeploy finished"));
  }

  render() {
    console.log("render deploy", this.preferences);
    if (!this.preferences) return "";
    return html`
      <pi-card title="Deploy">
        <pi-btn @click=${this.deploy}>Deploy</pi-btn>
        <section>
          <output></output>
          <div id="anchor"></div>
        </section>
        <div slot="footer">
          <pi-dialog xopen xnobutton>
            <pi-btn slot="button">Preferences</pi-btn>

            <pi-form-builder
              .value=${this.preferences}
              @pi-submit=${this.save_preferences}
            >
              <script type="json">
                {
                  "name": "deploy",
                  "fields": [
                    {
                      "type": "string",
                      "title": "Url",
                      "name": "url",
                      "validation": [{ "name": "required" }]
                    },
                    {
                      "type": "string",
                      "title": "Api-Key",
                      "name": "apikey"
                    },
                    {
                      "type": "number",
                      "title": "Rating",
                      "name": "rating",
                      "component": "Rating"
                    }
                  ]
                }
              </script>
            </pi-form-builder>
          </pi-dialog>
        </div>
      </pi-card>
    `;
  }
}


customElements.define("deploy-widget", DeployWidget);
