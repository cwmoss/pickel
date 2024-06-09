import schema from "src/schema";
import api from "src/api";
import SchemaObject from "./SchemaObject";
import { useDocumentStore } from "src/stores/document";
import { AsyncList, ListItem } from "./List";

const documentStore = useDocumentStore();


export class Editor extends SchemaObject {
    constructor(document) {
        super(document);
    }

    static fromId(id) {
        return new Editor(documentStore.document({ _id: id }));
    }

    id(id) {
        return this.clone({ id });
    }
    getId() {
        return this.get('id');
    }
    title(title) {
        return this.clone({ title });
    }
    getTitle() {
        return this.get('title');
    }
    schemaType(type) {
        return this.clone({ type });
    }
    getSchemaType() {
        return this.get('type');
    }
    documentId(documentId) {
        return this.id(documentId);
    }
    getDocumentId() {
        return this.getId();
    }

    getData() {
        return api.document(this.getId()) //this.getId() ? api.document(this.id) : {_type: this.getSchemaType()}
    }

    getPreview() {
        return schema.renderPreview(this._spec);
    }

    getDocument() {
        return this._spec;
    }

    setHighlight(highlight) {
        return this.clone({ highlight });
    }

    getHighlight() {
        return this.get('highlight');
    }

    clear() {
        documentStore.deleteDocument(this._spec);
        this.parent.setHighlight && this.parent.setHighlight(null)
    }
}



export class DocumentListItem extends ListItem {
    constructor(document) {
        super(document);
    }

    schemaType(type) {
        return this.clone({ type });
    }

    getSchemaType() {
        return this.get('type');
    }

    get document(){
      return this._spec;
    }
}

export class LoadingListItem extends ListItem {
    constructor(document) {
        super(document);
        this.loading = true;
    }
}


export class DocumentList extends AsyncList {
    constructor(attrs) {
        super(attrs);
        this.loadingItems = [];
    }
    schemaType(type) {
        this.clone({ type });
        this.count().then(count => this.total(count));
        return this;
    }

    getSchemaType() {
        return this.get('type');
    }

    filter(filter) {
        this.clone({ filter });
        this.count().then(count => this.total(count));
        return this;
    }

    getFilter() {
        return this.get('filter');
    }

    getItemById(id) {
        const doc = documentStore.document({ _id: id });
        return new DocumentListItem(doc).child(new Editor(doc)); // for path restore implement this method
    }

    total(total) {
        this.clone({ total });
        this.loadingItems = [];
        for (let i = 0; i < (total > this.pagination ? this.pagination : total); i++) {
            this.loadingItems.push(new LoadingListItem({ _id: i }));
        }
        return this;
    }

    getTotal() {
        return this.get('total');
    }

    async count() {
        const filter = this.getFilter();
        if (filter) {
            return api.count(`q(${filter})`);
        }
        const schemaType = this.getSchemaType();
        if (schemaType) {
            return api.count(`q(_type == "${schemaType}")`);
        }
    }

    async fetch() {
        let result;
        const filter = this.getFilter();
        if (filter) {
            console.log('fetch >>> filter: ', filter);
            result = api.documentQuery(filter, this.options);
        }
        const schemaType = this.getSchemaType();
        if (schemaType) {
            console.log('fetch >>> schemaType: ', schemaType);
            result = api.documents(schemaType, this.options);
        }

        if (!result) return [];
        return result.then(docs =>
            docs.map(doc => new DocumentListItem(doc).child(new Editor(doc))));
    }

    clear() {
        super.clear().forEach(item => item.getChild().clear());
    }

}


