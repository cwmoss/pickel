export class Toolbar {
    constructor(name) {
        this.name = name;
        this.items = [];
    }

    add(command, title) {
        this.items.push(new_item(command, title));
        return this;
    }

    items_for_menu() {
        return this.items;
    }
}

export function new_item(command, title) {
    return {
        command,
        title,
        active: false,
    };
}
