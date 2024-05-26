export function add_style(styles) {
  let tag = document.createElement("style");
  tag.appendChild(document.createTextNode(styles));
  document.getElementsByTagName("head")[0].appendChild(tag);
}

export function once(fn, context) {
  var result;
  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }
    return result;
  };
}
