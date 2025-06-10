import { kebabize } from "../lib/util.js";

/*

photog.RwGallery photog-rw-gallery -- pi-photog.-rw-gallery

*/
let paths = {
  "": "./",
  custom: "../custom/",
  upload: "../upload/",
};

let map = {
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
  url: "Url",
  email: "Email",
  rating: "Rating",
  imageupload: "ImageUpload",
  multiimageupload: "upload.MultiUpload",
  text: "Text",
  textarea: "Textarea",
  geopoint: "Geo",
  array: "ArrayContainer",
  object: "ObjectContainer",
  image: "ImageContainer",
  file: "FileContainer",
  imageobject: "ImageContainer",
};
let path = null;
let default_comp = "Output";
let classes = {};

export const get_classname = (name) => {
  if (/[.]/.test(name)) {
    console.log("(L)", name);
    return name;
  }
  name = name.toLowerCase();
  console.log("(L) map", name);
  return map[name] || default_comp;
};

export const get_component_tag = (name) => {
  let classname = get_classname(name);
  load_component(classname);

  if (/[.]/.test(classname)) {
    name = kebabize(classname);
    name = name.replace(".", "");
    return name;
  }
  return "pi-" + kebabize(classname);
};

export const get_component_element = (name) => {
  let tag = get_component_tag(name);

  return document.createElement(tag);
};

export const get_component = (name) => {
  let classname = get_classname(name);
  // console.log("++ get component", name, classname, classes);
  if (!classes[classname]) {
    console.error("could not load component", name, classname);
  }
  console.log("load component", name, classname);
  try {
    return new classes[classname]();
  } catch (error) {
    console.log(
      "~~~ could not construct component",
      classname,
      classes[classname],
      classes
    );
  }
};

export const resolve_components = async (types) => {
  types = types.map((t) => get_classname(t));
  console.log("$$ resolve (L) types0", types);
  types = [...new Set(types)];
  types = types.filter((el) => (classes[el] ? false : true));
  console.log("$$ resolve (L) types", types);
  return Promise.all(types.map((t) => load_component(t)));
};

const file_for_classname = (classname) => {
  let prefix = paths[""];
  let parts = classname.split(".");
  let file = parts.pop();
  if (parts.length) {
    let name_prefix = parts.shift();
    prefix = paths[name_prefix] ?? `../--${name_prefix}/`;
  }
  let path = parts.join("/") ?? "/";
  return prefix + path + kebabize(file) + ".js";
};
export const load_component = async (classname) => {
  //if (path == null) path = "./";
  //let file = path + kebabize(classname) + ".js";
  let file = file_for_classname(classname);
  console.log("+++ load component ", classname, file);

  //if (/^Custom/.test(classname)) {
  //  file = "/src/custom/" + kebabize(classname.replace("Custom", "")) + ".js";
  //}

  // console.log("++ load_component import as", classname, file);
  const { default: Component } = await import(file);
  classes[classname] = Component;
  // return new Component();
};
