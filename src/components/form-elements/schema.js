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
