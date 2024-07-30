import { kebabize } from "../lib/util.js";

const map = {
  string: "Input",
  select: "SelectSlow",
  radio: "Radios",
  check: "Checks",
  tags: "Tags",
  boolean: "Switch",
  switch: "Switch",
  reference: "Reference",
  slug: "Slug",
  datetime: "Datetime",
  date: "Date",
  number: "Number",
  imageupload: "ImageUpload",
  text: "Text",
  geopoint: "Geo",
  array: "ArrayContainer",
  object: "ObjectContainer",
  image: "ImageContainer",
  imageobject: "ImageContainer",
};
let path = null;
let default_comp = "Output";
let classes = {};

export const get_classname = (name) => {
  if (/^[A-Z]/.test(name)) {
    console.log("(L)", name);
    return name;
  }
  console.log("(L) map", name);
  return map[name] || default_comp;
};
export const get_component = (name) => {
  let classname = get_classname(name);
  // console.log("++ get component", name, classname, classes);
  if (!classes[classname]) {
    console.error("could not load component", name, classname);
  }
  console.log("load component", name, classname);
  return new classes[classname]();
};

export const resolve_components = async (types) => {
  types = types.map((t) => get_classname(t));
  console.log("$$ resolve (L) types0", types);
  types = [...new Set(types)];
  types = types.filter((el) => (classes[el] ? false : true));
  console.log("$$ resolve (L) types", types);
  return Promise.all(types.map((t) => load_component(t)));
};

export const load_component = async (classname) => {
  if (path == null) path = "./";
  let file = path + kebabize(classname) + ".js";
  console.log("+++ load component ", classname, file);
  if (/^Custom/.test(classname)) {
    file = "/src/custom/" + kebabize(classname.replace("Custom", "")) + ".js";
  }

  // console.log("++ load_component import as", classname, file);
  const { default: Component } = await import(file);
  classes[classname] = Component;
  // return new Component();
};
