class UrlStore {
  set_parameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    history.pushState(null, "", url);
  }

  get_parameter(name) {
    let params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  set_array(name, value) {
    this.set_parameter(name, value.join("~"));
  }

  get_array(name) {
    let p = this.get_parameter(name);
    if (!p) return [];
    return p.split("~");
  }
}

export default new UrlStore();
