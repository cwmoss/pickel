import api from "./api.js";
import schema from "../form-elements/schema.js";
import datasets from "./datasets.js";
import bus from "./bus.js";
import { default_root } from "../structure/nodes/index.js";

let structure = null;

class Project {
  name = "";
  loading = false;

  async load_current_project() {
    console.warn("loading project", schema.name, datasets.current);
    if (schema.name == datasets.current) {
      return;
    }

    //if (!this.loading) {
    this.loading = true;
    console.error("await schema", this.name);
    let all = await api.schema_all();
    console.log("$schemaswitch all", all);
    datasets.datasets = all;
    this.name = datasets.current;

    await schema.load(
      datasets.current,
      `${api.endpoint}/data/schema/${datasets.current}?js=1`
    );

    let { default: config } = await import(
      "../../schema/" + this.name + "/project.js"
    ).catch((e) => {
      console.warn("no project.js for schema", this.name, e);
      return { default: {} };
    });

    if (config.previews) {
      schema.set_previews(config.previews);
    }
    if (config.structure) {
      structure = config.structure;
    } else {
      structure = new default_root();
    }
    console.log("project loaded", this.name, structure);

    bus.emit(bus.ev.project_loaded, this);
    this.loading = false;
    return;
  }

  schema() {
    return schema;
  }

  get_structure() {
    return structure;
    return "oha";
  }

  datasets() {
    return datasets.datasets;
  }
}

export default new Project();
