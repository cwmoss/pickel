import { List, ListItem, DocumentList, DocumentListItem, Editor } from './base';
import schema from "src/schema";

export class StructureBuilder {
    list() {
        return new List();
    }
    listItem() {
        return new ListItem();
    }
    documentTypeListItems() {
        return schema.documentTypes()
            .map(type => this.documentTypeListItem(type.name)
                .title(type.title || type.name)
                .icon(type.icon || "o_folder"));
    }
    documentList() {
        return new DocumentList();
    }
    documentTypeList(schemaType) {
        return new DocumentList().schemaType(schemaType);
    }
    documentFilterList(filter) {
        return new DocumentList().filter(filter);
    }
    documentTypeListItem(schemaType) {
        return new DocumentListItem()
            .id(schemaType)
            .schemaType(schemaType)
            .child(
                new DocumentList()
                    .schemaType(schemaType)
                    .title(schemaType)
            );
    }
    editor() {
        return new Editor();
    }
    default() {
        return this.list().title("Content").items(this.documentTypeListItems());
    }
}

export default new StructureBuilder();
