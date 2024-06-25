import Countdown from "./countdown.js";

const alert = `<div class="alert alert-danger" role="alert">
<strong>Zeitüberschreitung</strong>
</div>
`;

/*
https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
*/
export default class MtanCountdown extends Countdown {
  async finished() {
    let url = this.getAttribute("finished");
    let form = this.closest("form");
    form.querySelectorAll("button,input").forEach((el) => (el.disabled = true));
    this.insertAdjacentHTML("afterend", alert);
    window.location.href = url;
  }
}

customElements.define("mtan-countdown", MtanCountdown);
