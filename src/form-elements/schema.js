/*

schema for formbuilder

it can be a ad-hoc schema or a slowhand schema

*/
let schema = {};

export function get_schema_type(name, schemaid = "default") {
  console.log("get schema", name, schemaid);
  return schema[schemaid].types.find((el) => el.name == name);
}

export function set_schema(s, schemaid = "default") {
  schema[schemaid] = s;
}

export function get_schema_first_document(schemaid = "default") {
  return schema[schemaid].types.find((el) => el.type == "document").name;
}

export function is_object(name, schemaid = "default") {
  return schema[schemaid].object_types.includes(name);
}

export function is_image(name, schemaid = "default") {
  return schema[schemaid].image_types.includes(name);
}

export function is_ref(name, schemaid = "default") {
  return schema[schemaid].refs.includes(name);
}
