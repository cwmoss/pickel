/*

global slowhand schema

*/

class schema {
  schema = {};
  name = "";
  load(schema, name) {
    this.schema = schema;
    this.name = name;
  }

  get documents() {
    return this.schema.types.filter((el) => el.type == "document");
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
  is_ref(name) {
    return this.schema.refs.includes(name);
  }
}

export default new schema();
