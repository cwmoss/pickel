// name: st.bernard
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

export default class Validator {
  fields = new WeakMap();

  f = null;

  constructor(form, rules, messages) {
    this.f = form;
    this.rules = this.normalize_rules(rules);
    this.messages = messages;
    this.init();
    this.observe();
    console.log(
      "++ format",
      format("hello i'm {name} and {age} old", { name: "Mike", age: 24 })
    );
  }

  init() {
    // this.get_rules();
    this.get_fields();
    //let me = this;
    //addEvent(this.f, "submit", function (e) {
    //  me.on_submit(e);
    //});
  }

  observe() {
    const targetNode = this.f;

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          //  console.log("A child node has been added or removed.");
          this.get_fields();
        } else if (mutation.type === "attributes") {
          //   console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing
    // observer.disconnect();
  }

  get data() {
    return new FormData(this.f);
  }

  get_value(el) {
    let data = this.data;
    let name = get_name(el);
    return this.fields.get(el).is_array ? data.getAll(name) : data.get(name);
  }

  get_fields(only_visible) {
    // console.log("elements...", this.f.elements);
    let els = Array.from(this.f.elements);
    // console.log(els);
    let fields = [];
    for (let el of els) {
      // console.log("get_fields", el);
      if (
        el.matches("input,select,textarea") &&
        get_name(el) && // &&   is_visible(el)
        (!only_visible || (only_visible && is_visible(el)))
      ) {
        this.update(el);
        fields.push(el);
      }
    }
    return fields;
  }
  update_map(el, prop, prop_val) {
    let f = this.fields.get(el);
    f[prop] = prop_val;
    this.fields.set(el, f);
  }
  update(el, trigger) {
    const name = get_name(el);
    if (!this.fields.has(el)) {
      let props = {
        fresh: true,
        name: name,
        id: el.id,
        has_error: false,
        is_click: is_click(el),
        is_array: is_array(el),
      };

      let me = this;
      if (!props.is_click) {
        addEventOnce(el, "input", function () {
          props.fresh = false;
          me.fields.set(el, props);
        });
        addEvent(el, "blur", function (e) {
          me.validate_ev(e, me);
        });
        addEvent(el, "input", function (e) {
          me.clear_ev(e, me);
        });
      } else {
        props.fresh = false;
        addEvent(el, "input", function (e) {
          console.log("input on click-el", e.target);
          me.validate_ev(e, me);
        });
      }
      // console.log("init field", props);
      this.fields.set(el, props);
    }
    const field = this.fields.get(el);
  }
  xxxon_submit(e) {
    console.log("+++ submit", e.submitter, e, this);
    if (hasAttr(e.submitter, "formnovalidate")) return;
    let fields = this.get_fields(true);
    let ok = this.validate_fields(fields);
    console.log("... all ok?", ok);
    e.preventDefault();
  }

  async validate_all(e) {
    console.log("+++ validate all", this);
    // example: button should submit data, but not stop
    //  on validation errors
    //  like a "back" button
    if (hasAttr(e.submitter, "formnovalidate")) return true;
    let fields = this.get_fields(true);
    let ok = await this.validate_fields(fields);
    console.log("... all ok?", ok);
    return ok;
  }

  validate_ev(e) {
    let el = e.target;
    if (this.fields.get(el)?.fresh) return;

    let val = this.get_value(el);

    // console.log("validate", e, el);
    // console.log("this", val);
    this.validate(el, get_name(el), val);
  }
  clear_ev(e) {
    let p = this.fields.get(e.target);
    if (p.has_error) {
      this.add_error(e.target, "");
    }
  }
  async validate_fields(els) {
    let ok = true;
    for (let el of els) {
      let name = get_name(el);
      let val = this.get_value(el);
      let validate_field_result = await this.validate(el, name, val);
      if (validate_field_result !== true) {
        console.log("err on ", name, el, validate_field_result);
        ok = false;
      }
    }
    return ok;
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
  async validate(el, name, val) {
    let rules = this.rules[name] ? this.rules[name] : [];
    console.log("rules...", name, this.rules);
    let msg = [];
    for (let rule of rules) {
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
          if (rsp_msg) msg.push(this.get_message(name, rule, rsp_msg));
        });
        let r = await promise;
      } else {
        console.log("missing method:", rule);
      }
    }
    console.log("+++ adding errors", msg);
    if (msg.length) {
      this.add_error(el, msg);
      this.update_map(el, "has_error", true);
      return false;
    } else {
      this.add_error(el, "");
      this.update_map(el, "has_error", false);
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
    Object.keys(rules).forEach((field) => {
      rules[field] = rules[field].map((rule) => {
        if (typeof rule === "string") {
          return { name: rule, opts: {} };
        } else {
          return rule;
        }
      });
    });
    return rules;
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
  get_message(name, rule, rmsg) {
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
