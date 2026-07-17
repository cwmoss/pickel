all: form3/form.css.js

form3/form.css.js: form3/form.css
	php form3/form-css.php > form3/form.css.js
