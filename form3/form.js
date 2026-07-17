class errors {
    /*
    Array [ {…}, {…} ]
    ​
    0: Object { field: "name", message: "Spielername darf nicht leer sein.", rule: "required" }
    */
    general_message = "";

    constructor(problems, original_result) {
        this.errors = problems ?? [];
        if (original_result) {
            if (original_result.message) {
                this.general_message = original_result.message;
            }
        }
    }

    get message() {
        let fields_msg = this.all();
        if (fields_msg) return fields_msg;
        return this.general_message;
    }
    on(field) {
        let errs = this.errors.filter((it) => it.field == field);
        if (!errs.length) return "";
        let msg = errs.map((it) => it.message);
        return msg.join("\n");
    }

    all() {
        let errs = this.errors.map((it) => it.message);
        if (!errs.length) return "";
        return errs.join("\n");
    }
}

class form {
    values = {};

    constructor() {
        this.errors = new errors();
        this.values = {};
    }
    handleEvent(ev) {
        console.log("UPD", this, ev.target.name, ev.target.value);
        this.values[ev.target.name] = ev.target.value;
    }
    problems(p) {
        this.errors = new errors(p);
    }
    update_value(name, value) {
        this.values[name] = value;
    }
    get_value(name) {
        return this.values[name] ?? "";
    }
}
export { errors, form };
