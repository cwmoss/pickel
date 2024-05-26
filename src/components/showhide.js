/*

alternative evtl. etwas besser:
https://whatabout.dev/the-hidden-attribute-and-animations/


.accordion__content {
  background: #eee;
  padding: 1rem;
  opacity: 0;
}
.accordion__content.expanded {
  animation: fadeIn .5s ease-out forwards;
}
.accordion__content.exiting {
  animation: fadeOut .5s ease-out forwards;
}

@keyframes fadeIn {
  0% {
    display: none;
    opacity: 0;
  }
  1% {
    display: block;
  }
  100% {
    display: block;
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    display: block;
    opacity: 1;
  }
  99% {
    display: block;
  }
  100% {
    display: none;
    opacity: 0;
  }
}


if (expanded) {
    content.classList.remove("expanded");
    content.classList.add("exiting");
    setTimeout(() => {
      content.classList.remove("exiting");
      content.setAttribute("hidden", true);
    }, 500);
  } else {
    content.classList.add("expanded");
    content.removeAttribute("hidden");
  }

*/
let styled = false;

function once(fn) {
  let run = false;
  return () => {
    if (run) return;
    run = true;
    fn();
  };
}
/*

alte variante

${tagname} [target] {
    opacity: 1;
    transition: all 0.5s ease;
  }
  ${tagname} [target].start {
    opacity: 0;
    transition: all 0.5s ease;
  }


*/

function add_style(tagname) {
  if (styled) return;
  styled = true;
  // return;
  const styles = `
  ${tagname} [target]{
    opacity: 1;
    height: auto;
    transition: opacity 0.5s ease,
      height 0.4s ease;
  }
  ${tagname} [target][hidden] {
    display: block !important;
    opacity: 0;
    height:0;
    transition: opacity 0.5s ease,
      height 0.4s ease;
  }
  `;
  let tag = document.createElement("style");
  tag.appendChild(document.createTextNode(styles));
  document.getElementsByTagName("head")[0].appendChild(tag);
}

export default class Showhide extends HTMLElement {
  connectedCallback() {
    add_style(this.tagName);
    this.trigger = this.querySelector("[trigger]");
    this.target = this.querySelector("[target]");
    let triggername = this.trigger.getAttribute("name");
    let alltriggers = this.querySelectorAll(`[name="${triggername}"]`);
    console.log(
      "connected",
      this.nodeName,
      this.trigger,
      this.trigger.name,
      this.target
    );
    // this.trigger_visibility();
    alltriggers.forEach((el) =>
      el.addEventListener("click", (e) => this.trigger_visibility(e))
    );
  }

  trigger_visibility(e) {
    console.log("+++ change event", this.trigger.checked, e);

    if (this.trigger.checked) {
      //  this.target.classList.add("start");
      this.target.removeAttribute("hidden");
      //  window.setTimeout(() => this.target.classList.remove("start"), 10);
      // this.target.style.display = "block";
    } else {
      //  this.target.classList.add("start");
      this.target.setAttribute("hidden", "");

      this.target.addEventListener(
        "transitionend",
        () => {
          //    this.target.setAttribute("hidden", "");
          //    this.target.classList.remove("start");
        },
        { once: true }
      );
      // this.target.style.display = "none";
    }
  }
}
