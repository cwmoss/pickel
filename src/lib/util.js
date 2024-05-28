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

export const hashID = (size) => {
  const MASK = 0x3d;
  const LETTERS = "abcdefghijklmnopqrstuvwxyz";
  const NUMBERS = "1234567890";
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}_-`.split("");

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, "");
};
