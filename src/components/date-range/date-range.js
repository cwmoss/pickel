import { LitElement, css, html } from "./../../vendor/lit-core.min.js";
import HotelDatepicker from "./hotel-datepicker.esm.js";
import pickerstyles from "./hotel-datepicker.css.js";
/*
https://lopezb.com/hoteldatepicker/
*/

let de = {
  selected: "Dein Aufenthalt:",
  night: "Nacht",
  nights: "Nächte",
  button: "Schliessen",
  clearButton: "Löschen",
  submitButton: "Abschicken",
  "checkin-disabled": "Check-in disabled",
  "checkout-disabled": "Check-out disabled",
  "day-names-short": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  "day-names": [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  "month-names-short": [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
  "month-names": [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  "error-more": "Date range should not be more than 1 night",
  "error-more-plural": "Date range should not be more than %d nights",
  "error-less": "Date range should not be less than 1 night",
  "error-less-plural": "Date range should not be less than %d nights",
  "info-more": "Please select a date range of at least 1 night",
  "info-more-plural": "Please select a date range of at least %d nights",
  "info-range": "Please select a date range between %d and %d nights",
  "info-range-equal": "Please select a date range of %d nights",
  "info-default": "Please select a date range",
  "aria-application": "Calendar",
  "aria-selected-checkin": "Selected as check-in date, %s",
  "aria-selected-checkout": "Selected as check-out date, %s",
  "aria-selected": "Selected, %s",
  "aria-disabled": "Not available, %s",
  "aria-choose-checkin": "Choose %s as your check-in date",
  "aria-choose-checkout": "Choose %s as your check-out date",
  "aria-prev-month": "Move backward to switch to the previous month",
  "aria-next-month": "Move forward to switch to the next month",
  "aria-close-button": "Close the datepicker",
  "aria-clear-button": "Clear the selected dates",
  "aria-submit-button": "Submit the form",
};

let styled = false;

function add_style() {
  console.log("styles...", pickerstyles);
  if (styled) return;
  styled = true;
  var tag = document.createElement("style");
  tag.appendChild(document.createTextNode(pickerstyles));
  document.getElementsByTagName("head")[0].appendChild(tag);
}

export default class DateRange extends LitElement {
  static properties = {
    picker: {},
    input: {},
  };

  constructor() {
    super();
    add_style();
  }

  connectedCallback() {
    super.connectedCallback();
    this.input = this.querySelector("input");
    //this.input = document.createElement("input");
  }

  firstUpdated() {
    this.input = this.querySelector("input");
    this.picker = new HotelDatepicker(this.input, {
      startOfWeek: "monday",
      format: "DD.MM.YYYY",
      disabledDates: [],
      i18n: de,
    });
  }

  render_input() {
    return html`
      <div><input type="text" id="hdp" name="accomodation-range" /></div>
    `;
  }
  render() {
    return html` <div>${this.input}</div> `;
  }

  /*
    der picker funktioniert nur im light dom
  */
  createRenderRoot() {
    return this;
  }
}

customElements.define("b-date-range", DateRange);
