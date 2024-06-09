import SchemaObject from "./SchemaObject";
import schema from "src/schema";

export class ListItem extends SchemaObject {
    title(title) {
        return this.clone({ title });
    }
    getTitle() {
        return this.get('title');
    }
    id(id) {
        return this.clone({ id });
    }
    getId() {
        return this.get('id');
    }
    icon(icon) {
        return this.clone({ icon });
    }
    getIcon() {
        return this.get('icon');
    }
    child(child) {
        return this.clone({ child: child.setParent(this) });
    }
    getChild() {
        return this.get('child');
    }

    getPreview() {
        return schema.renderPreview(this._spec) || this.getTitle() || this._spec._type;
    }
}

export class List extends SchemaObject {
    items(items) {
        return this.clone({ items });
    }
    getItems() {
        return this.get('items');
    }
    title(title) {
        return this.clone({ title });
    }
    getTitle() {
        return this.get('title');
    }

    getItemById(id) {
        return this.getItems().find(c => c.getId() === id); // for path restore implement this method
    }

    getPreview() {
        return this.getTitle() || this._spec.name || this._spec._type;
    }

    clear() { }
}


// Template class for all async list classes
export class AsyncList extends List {
    constructor(attrs) {
        super(attrs);
        this.options = this.options || { preview: true };
        this.pagination = attrs?.pagination || 50;
        this.options.limit = this.pagination;
        this.options.offset = -this.pagination;
        this.items([]);
    }

    async fetch() { throw 'Implement this method!' }

    async getItemById(id) { throw 'Implement this method!' }

    async fetchNextItems() {
        const items = this.getItems();
        this.options.offset += this.pagination;
        const newItems = await this.fetch();
        this._items = [...await items, ...newItems];
        return newItems;
    }

    async total() { throw 'Implement this method!' }

    clear() {
        this.options.limit = this.pagination * 2;
        this.options.offset = this.pagination;
        const items = this.getItems();
        this.items(items.splice(0, this.pagination)); // keep the first 50 items in cache
        // this.items([]) // remove all items from cache
        return items; // return items to clear
    }
}
