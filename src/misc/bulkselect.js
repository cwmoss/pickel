export default class Bulkselect extends HTMLElement {
  connectedCallback() {
    // console.log("bulkselect");
    this.all = this.querySelector(".all");
    this.none = this.querySelector(".none");
    this.revert = this.querySelector(".revert");
    this.actions = this.querySelectorAll(".actions button");
    this.implicit_select = this.getAttribute("implicit-select");
    //if(implicit_select){
    //  this.querySelector(implicit_select).parentElement
    //}
    this.all.addEventListener("click", (e) => this.on_all(e));
    this.none.addEventListener("click", (e) => this.on_none(e));
    this.revert.addEventListener("click", (e) => this.on_revert(e));
    this.addEventListener("click", (e) => this.on_check(e));
    this.update_button_status();
  }

  update_button_status() {
    let active = Array.from(this.querySelectorAll("input[type=checkbox]")).some(
      (el) => el.checked
    );
    // console.log("++ active?", active);
    this.actions.forEach((button) => (button.disabled = !active));
  }

  on_check(e) {
    if (e.target.tagName == "INPUT") {
      this.update_button_status();
    } else {
      if (
        this.implicit_select &&
        e.target.tagName != "A" /*&& e.target.matches(this.implicit_select)*/
      ) {
        // console.log("+++ implicit!", e);
        const cb = e.target
          .closest(".postbox-item")
          .querySelector("input[type=checkbox]");
        if (cb) cb.checked = !cb.checked;
        this.update_button_status();
      }
    }
  }

  on_implicit(e) {}

  on_all(e) {
    e.preventDefault();
    this.querySelectorAll("input[type=checkbox]").forEach(
      (ck) => (ck.checked = true)
    );
    this.update_button_status();
  }

  on_none(e) {
    e.preventDefault();
    this.querySelectorAll("input[type=checkbox]").forEach(
      (ck) => (ck.checked = false)
    );
    this.update_button_status();
  }

  on_revert(e) {
    e.preventDefault();
    this.querySelectorAll("input[type=checkbox]").forEach(
      (ck) => (ck.checked = !ck.checked)
    );
    this.update_button_status();
  }
}

customElements.define("bulk-select", Bulkselect);
