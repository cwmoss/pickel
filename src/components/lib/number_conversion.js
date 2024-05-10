export default {
  to_local: function (numberval) {
    console.log("+++ number", numberval);
    let options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      // style: "currency",
      // currencyDisplay: "symbol",
    };
    return numberval.toLocaleString("de-DE", options);
  },

  to_number: function (stringval) {
    let val = stringval.replaceAll(/[^0-9,]/g, "").replace(",", ".");
    console.log("+++ to_number", val);
    return Number(val);
  },

  is_valid: function (stringval) {
    return (
      /^\d+(,\d{2})?$/.test(stringval) ||
      /^([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/.test(stringval)
    );
  },
};
