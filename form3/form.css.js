import { LitElement, css, html, live } from "./lit-all.min.js";

export const formcss = css`/* Forms3  */
a b,
a strong,
button {
  background-color: var(--color);
  border: 2px solid var(--color);
  color: var(--color-bg);
}

button:disabled,
input:disabled {
  background: var(--color-bg-secondary);
  border-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

button[disabled]:hover,
input[type="submit"][disabled]:hover {
  filter: none;
}

form {
  border: 1px solid var(--color-bg-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow) var(--color-shadow);
  display: block;
  max-width: var(--width-card-wide);
  min-width: var(--width-card);
  padding: 1.5rem;
  text-align: var(--justify-normal);
}

form header {
  margin: 1.5rem 0;
  padding: 1.5rem 0;
}

input,
label,
select,
textarea {
  display: block;
  font-size: inherit;
  max-width: var(--width-card-wide);
}

input[type="checkbox"],
input[type="radio"] {
  display: inline-block;
}

input[type="checkbox"]+label,
input[type="radio"]+label {
  display: inline-block;
  font-weight: normal;
  position: relative;
  top: 1px;
}

input[type="range"] {
  padding: 0.4rem 0;
}

input,
select,
textarea {
  border: 1px solid var(--color-bg-secondary);
  border-radius: var(--border-radius);
  padding: 0.4rem 0.8rem;
}

input[type="text"],
input[type="password"],
input[type="email"],
textarea {
  width: calc(100% - 1.6rem);
}

input[readonly],
textarea[readonly] {
  background-color: var(--color-bg-secondary);
}

label {
  margin-bottom: 0.5rem;
}

label~label {
  margin-top: 1rem;
}

/* implicit labeled elements */
label>input {
  margin-top: 0.5rem;
}

input:focus {
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.valid-feedback,
.invalid-feedback {
  font-size: smaller;
  padding-left: 1.5rem;
}

.invalid-feedback {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: calc(0.9em + 0.375rem) calc(0.9em + 0.375rem);
}

input:has(+ .invalid-feedback:not(:empty)),
input:user-invalid {
  outline: 3px solid tomato;
}

.actions {
  margin-top: 2rem;
}`