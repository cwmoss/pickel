import {
    get_component,
    get_component_tag,
    resolve_components,
} from "./component-loader.js";

class ElementManager {

    constructor(schema) {
        this.schema = schema;
    }

    fields_to_els(fields, val, setup) {
        console.log("$ fields=>array", val);
        return fields.map((field) => {
            let name = `${setup.prefix}[${field.name}]`;
            let value = val[field.name] ?? undefined;
            let f = this.make_new_input(field, name, value, setup.level);
            return f;
        });
    }

    make_new_input(field, name, value, level) {
        // console.log("$ARR $OBJ new input", field);
        let fieldschema = this.schema.get_field_schema(field);
        let comp = this.schema.get_component_for_field(fieldschema);
        let tag = get_component_tag(comp);
        console.log(
            "$ARR $OBJ +++ build (new_input)",
            fieldschema.supertype,
            tag,
            field,
            fieldschema,
            value
        );
        // let is_container = schema.is_container(field);
        let f = document.createElement(tag);

        let setup = {
            label: field.title,
            name: field.name,
            id: field.name,
        };

        switch (fieldschema.supertype) {
            case "file":
            case "image":
                console.log(
                    "+++ build $IMG (image/file)",
                    f,
                    field,
                    fieldschema,
                    this.manager
                );
                setup.manager = this;
                setup.schema = fieldschema;
                setup.value = value ?? { asset: null };
                break;
            case "array":
                setup.manager = this;
                setup.options = fieldschema.options;
                setup.schema = fieldschema;
                setup.value = value ?? [];
                setup.level = (level ?? 0) + 1;
                break;
            case "object":
                setup.manager = this;
                setup.schema = fieldschema;
                setup.level = (level ?? 0) + 1;
                setup.value = value ?? {};
                break;
            case "reference":
                // f.manager = this.manager;
                setup.schema = fieldschema;
                setup.value = value ?? {};
                break;
            default:
                setup.originalType = field.type;
                setup.options = field.options;
                setup.initialValue = field.initialValue;
                setup.value = value;
        }

        if (field.validation && typeof f["set_validation"] === "function") {
            setup.validation = field.validation;
            //f.set_validation(field.validation);
            //console.warn("setting validations", field.validation, f);
        }
        f.setup = setup;
        return f;
    }
}

export default ElementManager;
