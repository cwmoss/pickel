const s = `{
    "image_types": [
        "gimage"
    ],
    "object_types": [
        "comment"
    ],
    "document_types": [
        "post",
        "author"
    ],
    "types": [
        {
            "name": "gimage",
            "type": "image",
            "title": "gimage",
            "description": null,
            "preview": {
                "title": "caption"
            },
            "fields": [
                {
                    "type": "string",
                    "title": "caption",
                    "name": "caption",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "string",
                    "title": "filename",
                    "name": "filename",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "reference",
                    "title": "asset",
                    "name": "asset",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": [],
                    "to": [
                        {
                            "type": "sh.asset"
                        }
                    ]
                }
            ]
        },
        {
            "name": "comment",
            "type": "object",
            "title": "comment",
            "description": null,
            "preview": {
                "title": "Text"
            },
            "fields": [
                {
                    "type": "string",
                    "title": "Text",
                    "name": "Text",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "string",
                    "title": "Timestamp_parsed",
                    "name": "Timestamp_parsed",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                }
            ]
        },
        {
            "name": "post",
            "type": "document",
            "title": "post",
            "description": null,
            "preview": {
                "title": "title"
            },
            "fields": [
                {
                    "type": "string",
                    "title": "Title",
                    "name": "title",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "switch",
                    "title": "Status",
                    "name": "status",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "string",
                    "title": "post_url",
                    "name": "post_url",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "string",
                    "title": "post_timestamp_parsed",
                    "name": "post_timestamp_parsed",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "string",
                    "title": "Text",
                    "name": "post_text_content",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "string",
                    "title": "body",
                    "name": "body",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "reference",
                    "title": "featured",
                    "name": "featured",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": [],
                    "to": [
                        {
                            "type": "post"
                        }
                    ]
                },
                {"name":"topcomment", "type":"comment","title":"Bester Kommentar", 
                "dialog_button":"Edit Comment",
                "opts":[]},
                {
                    "type": "reference",
                    "title": "author",
                    "name": "author",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": [],
                    "to": [
                        {
                            "type": "author"
                        }
                    ]
                },
                {
                    "type": "array",
                    "title": "auch interessant...",
                    "name": "related",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": [],
                    "of": [
                        {
                            "type": "reference",
                            "to": [
                                {
                                    "type": "post"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "array",
                    "title": "Kommentare",
                    "name": "comments",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": [],
                    "of": [
                        {
                            "type": "comment"
                        }
                    ]
                }
            ]
        },
        {
            "name": "author",
            "type": "document",
            "title": "author",
            "description": null,
            "preview": {
                "title": "name"
            },
            "fields": [
                {
                    "type": "string",
                    "title": "name",
                    "name": "name",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": []
                },
                {
                    "type": "array",
                    "title": "related",
                    "name": "related",
                    "description": null,
                    "hidden": false,
                    "readOnly": false,
                    "opts": [],
                    "of": [
                        {
                            "type": "reference",
                            "to": [
                                {
                                    "type": "post"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "refs": {
        "Gimage": {
            "asset": 0
        },
        "Post": {
            "featured": 0,
            "author": 0,
            "related": 1
        },
        "Author": {
            "related": 1
        }
    }
}`;

const d = JSON.parse(s);
export default d;
