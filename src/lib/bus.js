const events = {
  project_loaded: "project_loaded",
  page_loaded: "page_loaded",
};

class bus {
  ev = events;

  emit(eventname, data) {
    let name = "app." + eventname;
    const evt = new CustomEvent(name, {
      bubbles: false,
      detail: data,
    });
    document.dispatchEvent(evt);
  }

  subscribe(eventname, fn) {
    let name = "app." + eventname;
    document.addEventListener(name, fn);
  }
}

export default new bus();
