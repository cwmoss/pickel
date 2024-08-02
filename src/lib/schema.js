/*

global slowhand schema

*/

class schema {
  schema = {};
  name = "";
  previews = {};

  get_all_components_for(fieldschema, type) {
    // let schema = this.schema.types[type];
    if (this.is_object(fieldschema.type)) {
      return this.get_all_components_for_object(fieldschema);
    }
    if (fieldschema.type == "array") {
      return this.get_all_components_for_array(fieldschema);
    }
    if (fieldschema.type == "document") {
      return this.get_all_components_for_object(fieldschema);
    }
    console.log("all comp $$ resolve", fieldschema.type);
    if (this.is_image(fieldschema.type)) {
      console.log("all comp $$ resolve IMAGE", fieldschema.type);
      let types = this.get_all_components_for_object(fieldschema);
      types.push("imageupload");
      return types;
    }
  }

  get_all_components_for_array(schema) {
    let types = schema.of || [];
    types = types.map((f) => {
      let type_field = this.schema.types[f.type] ?? null;
      if (type_field) return this.get_component_for_field(type_field);
      else return f.type;
    });
    console.log("$ get types for array", schema);
    return types;
  }

  get_all_components_for_object(schema) {
    console.log("$ get types for OBJECT", schema);
    let fields = schema.fields || [];
    fields = fields.map((f) => this.get_component_for_field(f));
    return fields;
  }

  get_component_for_field(field) {
    if (field.component) {
      return field.component;
    }
    let type = field.supertype ?? field.type;
    if (type == "string") {
      console.log("$ get types for STRING", field);
      if (field?.options?.list) {
        return field.options.layout;
      }
    }
    if (type == "array") {
      if (field?.options?.layout) {
        return field.options.layout;
      }
      if (field?.options?.list) {
        return "check";
      }
    }
    return type;
  }

  get_field_schema(field) {
    let type = this.schema.types[field.type] ?? null;
    if (type) return Object.assign({}, type, field);
    return field;
  }

  new_component_for_field(field) {
    //
  }

  async load(name, endpoint) {
    console.log("$$ set schema (load)", schema, name);
    const { data, previews } = await import(endpoint);

    this.name = name;
    console.log("$schema types", data.types);
    data.document_types = data.types
      .filter((el) => el.type == "document")
      .map((d) => d.name);
    data.types = data.types.reduce(
      (obj, item) => ((obj[item.name] = item), obj),
      {}
    );
    this.schema = data;
    this.set_supertypes();
    // console.error("$schema", this.schema);
    this.previews = previews;
    console.log("previews", this.previews, this.schema);
  }
  // coming from project
  set_previews(studiopreviews) {
    this.previews = Object.assign({}, this.previews, studiopreviews);
    console.log("Updated studiopreviews", this.previews);
  }
  get_supertype(type) {
    if (this.is_object(type)) {
      return "object";
    }
    if (this.is_image(type)) {
      return "image";
    }
    if (this.is_reference(type)) {
      return "reference";
    }
    if (this.is_document(type)) {
      return "document";
    }
    return type;
  }

  set_definition(data) {
    // data might contain only one single document type
    if (data.fields) {
      (data.type = "document"),
        (data = {
          types: [data],
        });
    }
    data = Object.assign(
      {
        object_types: [],
        image_types: [],
        reference_types: [],
        types: [],
      },
      data
    );
    data.document_types = data.types
      .filter((el) => el.type == "document")
      .map((d) => d.name);
    data.types = data.types.reduce(
      (obj, item) => ((obj[item.name] = item), obj),
      {}
    );
    this.schema = data;
    this.set_supertypes();
    this.previews = {};
  }

  set_supertypes() {
    Object.keys(this.schema.types).forEach((key) => {
      console.log("$supertype for", key);
      this.schema.types[key].supertype = this.get_supertype(key);
      if (this.schema.types[key].fields) {
        console.log("$supertypes fields", this.schema.types[key].fields);
        this.schema.types[key].fields.forEach((fkey, idx) => {
          this.schema.types[key].fields[idx].supertype = this.get_supertype(
            fkey.type
          );
        });
      }
    });
  }
  get documents() {
    return this.schema.document_types.map((t) => this.schema.types[t]);
  }

  get document_types() {
    return this.schema.document_types;
  }

  get_type(name) {
    if (name == "array") return "array";
    console.log("get schema", name);
    let type = this.schema.types[name] ?? null;
    if (!type) console.error("schema-error type not found", name);
    return type;
  }
  get_schema_first_document() {
    return this.schema.types[this.schema.document_types[0]].name;
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
  is_document(name) {
    return name == "document" || this.document_types.includes(name);
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

export const schema_build = (definition) => {
  let s = new schema();
  if (typeof definition === "string") definition = JSON.parse(definition);
  s.set_definition(definition);
  return s;
};
