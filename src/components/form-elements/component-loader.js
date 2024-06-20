const map = {
  switch: "Switch",
  reference: "Input",
};
let path = null;
let default_comp = "Input";

export const load_component = async (name) => {
  if (path == null) path = "./";
  let classname = map[name] || default_comp;
  let file = path + classname.toLowerCase() + ".js";
  console.log("++ import as", name, file);
  const { default: Component } = await import(file);
  return new Component();
};
