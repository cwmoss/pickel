/*

validator for formbuilder custom elements

*/
import {
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
} from "./helper.js";
import { messages } from "./messages.js";
import { methods } from "./methods.js";

export default class FieldValidator {
  constructor(rules) {
    this.normalize_rules(rules);
  }

  is_error_msg(rsp) {
    if (rsp === false) return true;
    if (!rsp) return false;
    if (rsp === true) return false;
    if (typeof rsp === "string") return rsp;
    if (typeof rsp === "object") {
      if (rsp.ok === false) {
        return rsp.msg;
      }
    }
    return false;
  }

  validate_sync(val, el) {
    console.log("rules...", this.rules);
    let msg = [];
    for (let rule of this.rules) {
      // console.log("v", rule);
      let m = methods[rule.name];
      // console.log("m", m);
      if (m) {
        if (m.constructor.name == "AsyncFunction") {
          console.log("skip async validation", m);
          continue;
        }

        let ok = m(val, el, rule.opts);
        console.log("validation result", rule, ok);
        let rsp_msg = this.is_error_msg(ok);
        // TODO: el.name
        if (rsp_msg) msg.push(this.message(el._name, rule, rsp_msg));
      } else {
        console.log("missing method:", rule);
      }
    }
    console.log("+++ adding errors", msg);
    if (msg.length) {
      return msg.join("<p>");
    } else {
      return true;
    }
  }

  async validate(val, el) {
    console.log("rules...", this.rules);
    let msg = [];
    for (let rule of this.rules) {
      // console.log("v", rule);
      let m = methods[rule.name];
      // console.log("m", m);
      if (m) {
        console.log(
          "validation method... is async?",
          m,
          constructor.name == "AsyncFunction"
        );
        let promise = Promise.resolve(m(val, el, rule.opts)).then((ok) => {
          console.log("validation result", rule, ok);
          let rsp_msg = this.is_error_msg(ok);
          // TODO: el.name
          if (rsp_msg) msg.push(this.message(el._name, rule, rsp_msg));
        });
        let r = await promise;
      } else {
        console.log("missing method:", rule);
      }
    }
    console.log("+++ adding errors", msg);
    if (msg.length) {
      return msg.join("<p>");
    } else {
      return true;
    }
  }

  static add_method(name, method, message) {
    methods[name] = method;
    messages[name] =
      message !== undefined
        ? message
        : messages[name]
        ? messages[name]
        : "Invalid";
  }

  normalize_rules(rules) {
    if (!Array.isArray(rules)) return [];
    let msgs = {};
    rules = rules.map((rule) => {
      let r;
      if (typeof rule === "string") {
        r = { name: rule, opts: {} };
      } else {
        r = rule;
      }
      if (r.msg) {
        msgs[r.name] = r.msg;
      }
      return r;
    });

    this.rules = rules;
    this.messages = msgs;
  }

  add_error(field, msg) {
    console.log("add-error?", msg, field);
    let parent = field.closest(".fgroup");
    let maybe_group = parent ? true : false;

    if (!parent) parent = field.parentNode;
    let msg_container = parent.querySelector(".invalid-feedback");
    // console.log("msg container", msg_container);
    let msg_html = msg ? msg.join("<p>") : "";
    if (!msg_container) {
      parent.insertAdjacentHTML(
        "beforeend",
        '<div class="invalid-feedback">' + msg_html + "</div>"
      );
    } else {
      msg_container.innerHTML = msg_html;
    }

    if (msg) {
      setAttr(field, "aria-invalid", true);
      addClass(field, "is-invalid");
      addClass(parent, "is-invalid");
      // msg_container.innerHTML = msg;
    } else {
      if (maybe_group) {
        parent.querySelectorAll("input").forEach((el) => {
          setAttr(el, "aria-invalid", false);
          remClass(el, "is-invalid");
        });
      } else {
        setAttr(field, "aria-invalid", false);
        remClass(field, "is-invalid");
        // msg_container.innerHTML = "";
      }
      remClass(parent, "is-invalid");
    }
  }

  message(name, rule, rmsg) {
    let msg = "";
    if (this.messages[name] && this.messages[name][rule.name])
      msg = this.messages[name][rule.name];
    if (!msg && rmsg && typeof rmsg === "string") msg = rmsg;
    if (!msg)
      msg = messages[rule.name]
        ? messages[rule.name]
        : "Error on field " + name + " with rule " + rule.name;
    console.log("+++ msg ", name, rule, msg);
    return format(msg, {});
  }
}
