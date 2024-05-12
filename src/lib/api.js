console.log("import", import.meta);
let data = await fetch(import.meta.url + "/../data.json");
data = await data.json();
let types = Object.entries(data).map(([k, v]) => {
  return k;
});
let objects = [...data.doc, ...data.author];

class Api {
  constructor() {}

  get_types() {
    return types;
  }
  get_all(type) {
    return data[type];
  }
  get_doc(id) {
    return objects.find((o) => o.id == id);
  }
}

export default new Api();
