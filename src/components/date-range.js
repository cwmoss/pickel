export default class DateRange extends HTMLElement {
  connectedCallback() {
    this.start = this.querySelector("input");
    this.end = this.querySelector("input:last-of-type");
    console.log("start/end", this.start, this.end);
  }
}
