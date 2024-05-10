/*

https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

strategie:
  - für die darstellung wird requestAnimationFrame genutzt
  - für die "finished" aktion wird setTimeout genutzt
*/

export default class Countdown extends HTMLElement {
  connectedCallback() {
    this.minutes = parseInt(this.getAttribute("t"));
    this.seconds = this.minutes * 60 * 1000;
    this.done = false;
    this.unit = this.getAttribute("unit") ?? "min";
    let el = this.querySelector(".dwn");
    console.log("+++ countdown element", el);
    if (!el) {
      el = document
        .createRange()
        .createContextualFragment(
          `<span class="dwn tabular-numbers" role="timer"></span>`
        );
      this.append(el);
      el = this.querySelector(".dwn");
    }
    this.el = el;

    let restart = this.getAttribute("restart");
    let restart_form = this.getAttribute("restart-formid");
    if (restart || restart_form) {
      el.addEventListener("click", (e) =>
        this.on_restart(e, restart, restart_form, this)
      );
    }
    console.log("countdown", this.minutes, el);

    this.start(2);
  }

  start(glitch) {
    // this.start(2000);
    console.log("+++ start", new Date());
    this.to_id = setTimeout(
      () => this.finished(),
      this.seconds + glitch * 1000
    );
    this.done = false;
    this.lastFrameTime = Date.now();
    this.end = this.lastFrameTime + this.seconds + glitch * 1000; // glitch
    this.show({ m: this.minutes, s: 0 });
    console.log("start++", this.seconds, this.end, this.lastFrameTime);
    window.requestAnimationFrame(this.tick.bind(this));
  }

  tick(timestamp) {
    if (this.recent === undefined) {
      this.recent = timestamp;
    }
    const elapsed = timestamp - this.recent;
    //console.log("this tick", this.lastFrameTime);
    // console.log("delta", deltaTime);
    if (elapsed >= 1000) {
      this.recent = timestamp;
      // console.log("delta", elapsed);
      this.on_tick(Date.now());
    }
    if (!this.done) {
      window.requestAnimationFrame(this.tick.bind(this));
    }
  }

  on_tick(now) {
    let distance = this.end - now;
    // console.log("+++ distance", distance);
    // wenn wir noch über den minuten stehen, bleibt die anzeige unverändert
    if (distance > this.seconds) return;

    // console.log("distance", distance);
    if (distance < 0) {
      // clearInterval(this.loop);
      this.show({ d: 0, h: 0, m: 0, s: 0 });
      this.done = true;
      // this.finished();
    } else {
      this.show({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
  }

  xstart(glitch) {
    this.show({ m: this.minutes, s: 0 });

    let end = new Date().getTime() + this.seconds;

    let loop = function (render, element) {
      var running,
        lastFrame = +new Date();
      function loop(now) {
        // stop the loop if render returned false
        if (running !== false) {
          requestAnimationFrame(loop, element);
          running = render(now - lastFrame);
          lastFrame = now;
        }
      }
      loop(lastFrame);
    };

    loop(function (deltaT) {
      if (deltaT >= 1000) {
        elem.style.left = (left += (10 * deltaT) / 16) + "px";
        if (left > 400) {
          return false;
        }
      }

      // optional 2nd arg: elem containing the animation
    }, this.el);
  }

  async on_restart(e, url, form, me) {
    console.log("restart", this, url, me);
    clearTimeout(this.to_id);
    let res = null;
    if (form) {
      res = await this.fetch_form(form);
    } else {
      res = await fetch(url, { method: "POST" });
    }

    let cont = await res.text();
    this.start(1);
  }

  async fetch_form(formid) {
    let form = document.getElementById(formid);
    let method = form.method;
    let url = form.action;
    let data = new URLSearchParams(new FormData(form));
    return await fetch(url, { method: method, body: data });
  }

  show(numbers) {
    this.el.innerText =
      numbers.m.toString().padStart(2, "0") +
      ":" +
      numbers.s.toString().padStart(2, "0") +
      " " +
      this.unit;
  }

  async finished() {
    console.log("+++ end", new Date());
    let url = this.getAttribute("finished");
    if (url) {
      fetch(url);
    } else {
      let formid = this.getAttribute("finished-formid");
      if (formid) {
        document.getElementById(formid).submit();
      }
    }
  }
}
