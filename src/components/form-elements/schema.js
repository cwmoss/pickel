let schema = {};

export function get_schema_type(name) {
  console.log("get schema", name);
  return schema.types.find((el) => el.name == name);
}

export function set_schema(s) {
  schema = s;
}
