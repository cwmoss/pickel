import { addClass, remClass, get_name, empty } from "./helper.js";

let dia_krit =
  "ŠšŽžŒœŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ";

export const methods = {
  required: function (value, element, param) {
    // Check if dependency is met
    //if (!this.depend(param, element)) {
    //  return "dependency-mismatch";
    //}
    // console.log("required", value);
    console.log("++ required rule", value, element, param);
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string")
      return value !== undefined && value !== null && value.length > 0;
    return value !== undefined && !isNaN(value) && value !== null;
  },

  // https://jqueryvalidation.org/email-method/
  email: function (value, element) {
    // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    // Retrieved 2014-01-14
    // If you have a problem with this implementation, report a bug against the above spec
    // Or use custom methods to implement your own email validation
    // console.log("email-regex for", value);
    return (
      empty(value) ||
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        value
      )
    );
  },
  format: function (value, element, param) {
    param = param.replace(/BOB_DIA_OK/, dia_krit);
    let regex = new RegExp(param);
    //  console.log(regex);
    return empty(value) || regex.test(value);
  },
  pin2: function (value, element) {
    // "PIN muss aus Ziffern und Kleinbuchstaben und Großbuchstaben bestehen."
    return (
      empty(value) ||
      (/\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value))
    );
  },
  /*
  $tests = [
         '^\d+(,\d{2})?$',
         '^([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)$',
      ];
      */
  eurocent: function (value) {
    return (
      empty(value) ||
      /^\d+(,\d{2})?$/.test(value) ||
      /^([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)$/.test(value)
    );
  },
  // https://jqueryvalidation.org/equalTo-method/
  equalTo: function (value, element, param) {
    if (!param) param = element.id + "_confirmation";
    const target = document.querySelector(param);
    // Bind to the blur event of the target in order to revalidate whenever the target field is updated
    /*var target = $( param );
    if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
      target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
        $( element ).valid();
      } );
    }
    */
    console.log("++ equalTo", value, param, element, target);
    return value === target.value;
  },
  acceptcheckbox: function (value, element) {
    return element.checked;
  },

  minlength: function (value, element, param) {
    return empty(value) || value.length >= param;
  },

  // https://jqueryvalidation.org/maxlength-method/
  maxlength: function (value, element, param) {
    console.log("++ max rule", value, element, param);
    return empty(value) || value.length <= param;
  },

  fetch: async function (value, element) {
    if (!value) return true;
    // let result = await fetch("/check_username", { value });
    // return false;
    let url = "/check_username";
    let data = { name: get_name(element), value: value };
    let response_data = {};
    let response;
    addClass(element.parentNode, "pending");
    try {
      response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      response_data = await response.json();
      console.log("fetch data", response_data);
      remClass(element.parentNode, "pending");
      return response_data;
    } catch (error) {
      console.log("error in fetch method");
    }
    return true;
  },
};
