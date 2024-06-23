const map = {
  string: "Input",
  boolean: "Switch",
  switch: "Switch",
  reference: "Reference",
  slug: "Slug",
  datetime: "Datetime",
  date: "Date",
  image: "Image",
};
let path = null;
let default_comp = "Output";
let classes = {};

export const get_classname = (name) => {
  return map[name] || default_comp;
};
export const get_component = (name) => {
  let classname = get_classname(name);
  // console.log("++ get component", name, classname, classes);
  return new classes[classname]();
};

export const resolve_components = async (types) => {
  types = types.map((t) => get_classname(t));
  types = [...new Set(types)];
  types = types.filter((el) => (classes[el] ? false : true));
  // console.log("resolve types", types);
  return Promise.all(types.map((t) => load_component(t)));
};

export const load_component = async (classname) => {
  if (path == null) path = "./";
  let file = path + classname.toLowerCase() + ".js";
  // console.log("++ load_component import as", classname, file);
  const { default: Component } = await import(file);
  classes[classname] = Component;
  // return new Component();
};
