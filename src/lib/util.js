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

export const slugify_simple = (str) => {
  str = str.trim(); // trim leading/trailing spaces
  str = str.toLowerCase(); // convert to lowercase
  str = str
    .replace(/[^a-z0-9 -_.]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by "-"
    .replace(/-+/g, "-"); // collapse dashes
  return str;
};

export const hashID = (size) => {
  const MASK = 0x3d;
  const LETTERS = "abcdefghijklmnopqrstuvwxyz";
  const NUMBERS = "1234567890";
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}_-`.split("");

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, "");
};

// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
/**
 * Retrieve nested item from object/array
 * @param {Object|Array} obj
 * @param {String} path dot separated
 * @param {*} def default value ( if result undefined )
 * @returns {*}
 */
export const resolve_path = (obj, path, def) => {
  if (!path) return obj;
  var i, len;

  for (i = 0, path = path.split("."), len = path.length; i < len; i++) {
    if (!obj || typeof obj !== "object") return def;
    obj = obj[path[i]];
  }

  if (obj === undefined) return def;
  return obj;
};
