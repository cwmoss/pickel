let templates = {};

export const load_template = async (name) => {
  let tname = typeof name === "string" ? name : name.constructor.name;
  console.log("++ page", tname);
  if (!templates[tname]) {
    console.log("++loading template", tname);
    let tpl = await fetch(
      `${import.meta.url}/../../pages/${tname.toLowerCase()}.html`
    );
    let text = await tpl.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/html");
    templates[tname] = doc.querySelectorAll("template");
    console.log("++ loaded doc", doc.querySelectorAll("template"));
  }

  return templates[tname];
};
