const format = (msg, params) =>
  msg.replace(
    /{(\w+)}/g,
    (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
      params.hasOwnProperty(placeholderWithoutDelimiters)
        ? params[placeholderWithoutDelimiters]
        : placeholderWithDelimiters
  );

const optional = (el) => false;
const is_visible = (el) =>
  el.style.display !== "none" &&
  el.visibility !== "hidden" &&
  el.offsetParent !== null;

const isHtmlElement = (el, type) => {
  const isInstanceOfHTML = el instanceof HTMLElement;
  return type ? isInstanceOfHTML && el.matches(type) : isInstanceOfHTML;
};

const includes = (array, string) =>
  Array.isArray(array) && array.includes(string);

const addEvent = (el, event, callback) => el.addEventListener(event, callback);

const addEventOnce = (el, event, callback) =>
  el.addEventListener(event, callback, { once: true });

const getAttr = (el, attr) => el.getAttribute(attr);
const hasAttr = (el, attr) => el.hasAttribute(attr);
const setAttr = (el, attr, value = "") => el.setAttribute(attr, value);

const addClass = (el, cls) => el.classList.add(cls);
const remClass = (el, cls) => el.classList.remove(cls);

const getEl = (el) =>
  isHtmlElement(el)
    ? el
    : document.getElementById(el) || document.querySelector(`[name ="${el}"]`);

const is_click = (el) =>
  el.tagName == "SELECT" || el.type == "checkbox" || el.type == "radio";
const is_array = (el) =>
  el.hasAttribute("multiple") ||
  (el.type == "checkbox" && get_name(el).endsWith("[]"));

const get_name = (el) => getAttr(el, "name");
const get_name_or_id = (el) => getAttr(el, "name") || getAttr(el, "id");

const trim = function (str) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim#Polyfill
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};

const empty = function (value) {
  if (Array.isArray(value)) {
    return value.length == 0;
  }
  return value === undefined || value === null || value.length == 0;
};

export {
  format,
  is_visible,
  isHtmlElement,
  includes,
  addEvent,
  addEventOnce,
  getAttr,
  hasAttr,
  setAttr,
  addClass,
  remClass,
  getEl,
  is_click,
  is_array,
  get_name,
  get_name_or_id,
  trim,
  empty,
};
