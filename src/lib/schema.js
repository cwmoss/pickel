/*

global slowhand schema

*/

class schema {
  schema = {};
  name = "";
  previews = {};

  async load(name, endpoint) {
    console.log("$$ set schema (load)", schema, name);
    const { data, previews } = await import(endpoint);
    this.schema = data;
    this.name = name;
    let { default: studiopreviews } = await import(
      "../../schema/" + name + "/preview.js"
    ).catch((e) => {
      console.warn("no previews for schema", name);
      return { default: {} };
    });
    this.previews = Object.assign({}, previews, studiopreviews);
    console.log("previews", this.previews, this.schema);
  }

  async xxload(schema, name) {
    console.log("$$ set schema (load)", schema, name);
    this.schema = schema;
    this.name = name;
    let previews = await import("../../schema/" + name + "/preview.js").catch(
      (e) => {
        console.warn("no previews for schema", name);
        return { default: {} };
      }
    );
    this.previews = previews.default;
    console.log("previews", this.previews);
  }

  get documents() {
    return this.schema.types.filter((el) => el.type == "document");
  }

  get document_types() {
    return this.documents.map((d) => d.name);
  }

  get_type(name) {
    if (name == "array") return "array";
    console.log("get schema", name);
    let type = this.schema.types.find((el) => el.name == name);
    if (!type) console.error("schema-error type not found", name);
    return type;
  }
  get_schema_first_document() {
    return this.schema.types.find((el) => el.type == "document").name;
  }
  is_object(name) {
    return this.schema.object_types.includes(name);
  }
  is_image(name) {
    return this.schema.image_types.includes(name);
  }
  is_reference(name) {
    return this.schema.reference_types.includes(name);
  }

  get_icon(type) {
    if (type) {
      return this.get_type(type).icon ?? "";
    }
  }
  get_preview(data) {
    let type = data?._type;
    console.log("$ schema get_preview", type, data, this.previews[type]);
    if (!type) return null;
    if (this.previews[type] && data) {
      try {
        return this.previews[type](data);
      } catch (e) {
        console.warn("$schema could not make preview", e);
        return null;
      }
    }
    return null;
  }
}

export default new schema();
