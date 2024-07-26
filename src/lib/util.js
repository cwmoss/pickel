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
// typeof x === 'object' && !Array.isArray(x) && x !== null

export const slugify_simple = (str) => {
  if (!str) return "";
  str = str.trim(); // trim leading/trailing spaces
  str = str.toLowerCase(); // convert to lowercase
  str = str
    .replace(/[^a-z0-9 -_.]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by "-"
    .replace(/-+/g, "-"); // collapse dashes
  return str;
};

export const slugify = (str) => {
  return str
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, ""); // Remove trailing -
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

export const js = (strings, ...expressions) => {
  let returnString = "";
  for (let i = 0; i < expressions.length; i++) {
    returnString += strings[i] + expressions[i];
  }
  returnString += strings[strings.length - 1];
  return returnString;
};

export const kebabize = (str) =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
  );

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
  console.error("$path resolve", path);
  var i, len;

  for (i = 0, path = path.split("."), len = path.length; i < len; i++) {
    if (!obj || typeof obj !== "object") return def;
    obj = obj[path[i]];
  }

  if (obj === undefined) return def;
  return obj;
};

/*
https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
*/
export const to_json2 = (fdata) => {
  return Array.from(fdata.entries()).reduce((data, [field, value]) => {
    let [_, prefix, keys] = field.match(/^([^\[]+)((?:\[[^\]]*\])*)/);

    if (keys) {
      keys = Array.from(keys.matchAll(/\[([^\]]*)\]/g), (m) => m[1]);
      value = this.update_serialize(data[prefix], keys, value);
    }
    data[prefix] = value;
    return data;
  }, {});
};
export const to_json = (fdata) => {
  const f = Array.from(fdata);
  const obj = f.reduce((o, [k, v]) => {
    let a = v,
      b,
      i,
      m = k.split("["),
      n = m[0],
      l = m.length;
    if (l > 1) {
      a = b = o[n] || [];
      for (i = 1; i < l; i++) {
        m[i] = (m[i].split("]")[0] || b.length) * 1;
        b = b[m[i]] = i + 1 == l ? v : b[m[i]] || [];
      }
    }
    return { ...o, [n]: a };
  }, {});
  return obj;
};

export const is_empty = (value) => {
  //if (typeof value !== 'object') {
  // boolean, number, string, function, etc.
  //  return false;
  //}

  // console.error("empty array?", this._name, value);
  if (Array.isArray(value)) {
    return value.length == 0;
  }

  const proto = Object.getPrototypeOf(value);

  // consider `Object.create(null)`, commonly used as a safe map
  // before `Map` support, an empty object as well as `{}`
  if (proto !== null && proto !== Object.prototype) {
    return false;
  }

  for (const prop in value) {
    if (Object.hasOwn(value, prop)) {
      return false;
    }
  }
  return true;
};
