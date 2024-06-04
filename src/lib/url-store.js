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
}

export default new UrlStore();
