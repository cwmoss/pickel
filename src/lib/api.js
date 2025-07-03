import datasets from "./datasets.js";
import schema from "../form-elements/schema.js";
import { toast_alert, toast_info } from "../basic/toast.js";
class Api {
  loading = false;

  constructor() {
    this.endpoint = `http://localhost:10245`;
    this.datasets = [];
    // this.documentStore = useDocumentStore();
  }

  async get(path) {
    return fetch(`${this.endpoint}${path}`).then((resp) => resp.json());
  }

  async post(path, data) {
    return fetch(`${this.endpoint}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((resp) => resp.json());
  }

  async graphql(query, vars) {
    if (!vars) vars = {};
    return this.post("/admin", { query: query, variables: vars });
  }

  async query(query, options) {
    if (options) {
      if (options.limit) {
        if (options.offset) {
          query += `limit(${options.limit} ${options.offset})`;
        } else {
          if (options.page) {
            let offset = (options.page - 1) * options.limit;
            query += `limit(${options.limit} ${offset})`;
          } else {
            query += `limit(${options.limit})`;
          }
        }
      }
      if (options.preview) {
        query += "preview()";
      }
      if (options.count) {
        query += "count()";
      }
      if (options.pageinfo) {
        query += "pageinfo()";
      }
      if (options.order) {
        query += `order(${options.order.by} ${
          options.order.desc ? "desc" : "asc"
        })`;
      }
    }
    return this.get(
      `/data/query/${datasets.current}?query=${encodeURIComponent(query)}`
    );
  }

  async count(query) {
    return this.get(
      `/data/count/${datasets.current}?query=${encodeURIComponent(query)}`
    ).then(({ pageinfo }) => pageinfo.total);
  }

  async mutate(document) {
    return this.post(`/data/mutate/${datasets.current}`, {
      mutations: [{ createOrReplace: document }],
    }).then(() => document);
    // this.documentStore.document(document)
  }

  async create(document) {
    return this.post(`/data/mutate/${datasets.current}`, {
      mutations: [{ createOrReplace: document }],
    }).then(() => document);
  }

  async action(name, document) {
    let result = await this.post(`/data/custom_action/${datasets.current}`, {
      name: name,
      document: document,
    });
    if (result.message ?? false) {
      if (result.ok) toast_info(result.message);
      else toast_alert(result.message);
    }
    return result;
  }
  search(term, type, preview = false) {
    let q = `/data/search/${datasets.current}?q=${term}`;
    if (type) q += `&type=${type}`;
    if (preview) q += `&preview=1`;
    return this.get(q);
  }

  info() {
    return this.get(`/data/info/${datasets.current}`);
  }

  async yycurrent_schema() {
    if (schema.name == datasets.current) {
      return schema;
    }
    //if (!this.loading) {
    this.loading = true;
    console.error("await schema");
    let all = await this.schema_all();
    console.log("$schemaswitch all", all);
    datasets.datasets = all;
    this.datasets = all;
    await schema.load(
      datasets.current,
      `${this.endpoint}/data/schema/${datasets.current}?js=1`
    );
    this.loading = false;
    return schema;
    //}
  }

  async xxxcurrent_schema() {
    if (schema.name == datasets.current) {
      return schema;
    }
    let all = await this.schema_all();
    console.log("$schemaswitch all", all);
    datasets.datasets = all;
    this.datasets = all;
    let s = await this.schema();
    await schema.load(s, datasets.current);

    return schema;
  }

  async schema() {
    let schema = await this.get(`/data/schema/${datasets.current}`);
    return schema;
  }

  async schema_all() {
    let all = await this.get(`/data/index`);
    return all;
  }

  images() {
    return `${this.endpoint}/images`;
  }

  files() {
    return `${this.endpoint}/files`;
  }

  download_file_url(id) {
    return `${this.endpoint}/files/${datasets.current}/${id}`;
  }

  dataset() {
    return datasets.current;
  }

  assets() {
    return `${this.endpoint}/assets`;
  }

  assetUrl(image, opts) {
    let params = new URLSearchParams("");
    for (let prop in opts) {
      params.append(prop, opts[prop]);
    }
    return `${this.endpoint}${image.url}?${params.toString()}`;
  }

  async image(id) {
    return this.query(`q(_id=="${id}" && _type="sh.image")`).then(
      (resp) => resp.result[0]
    );
  }

  async file(id) {
    return this.query(`q(_id=="${id}" && _type="sh.file")`).then(
      (resp) => resp.result[0]
    );
  }

  async asset(id) {
    return this.query(
      `q(_id=="${id}" || assetId=="${id}" && _type in ["sh.image", "sh.file"])`
    ).then((resp) => resp.result[0]);
  }

  // ref can be a reference or asset or ID
  imageurl_from_ref(ref, opts = {}) {
    console.log("$ api-imageurl", ref);
    if (!ref) return "";
    if (typeof ref === "object") ref = ref?._ref ?? ref._id ?? null;
    console.log("$ api-imageurl ++ parts", ref);
    if (!ref) return "";
    let parts = ref.split("-");
    parts.shift();
    let suffix = parts.pop();
    console.log("$ api-imageurl ++ parts", ref, parts);
    let size = "size=300x300&mode=fit";
    if (opts.preview) {
      size = "size=50x50&mode=fit";
    }
    return `${this.endpoint}/images/${datasets.current}/${parts.join(
      "-"
    )}.${suffix}?${size}`;
  }

  upload_image_url() {
    return `${this.endpoint}/assets/images/${datasets.current}/`;
  }

  async uploadImage(image) {
    return fetch(
      `${this.endpoint}/assets/images/${datasets.current}/?filename=${image.name}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: image,
      }
    ).then((resp) => resp.json());
  }

  async uploadFile(file) {
    return fetch(
      `${this.endpoint}/assets/files/${datasets.current}/?filename=${file.name}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: file,
      }
    ).then((resp) => resp.json());
  }

  async document_preview(documentId) {
    return this.document(documentId, true);
  }
  async document(documentId, preview) {
    return this.get(
      `/data/doc/${datasets.current}/${documentId}${
        preview ? "?preview=1" : ""
      }`
    )
      .then(({ documents }) => (documents ? documents[0] : null))
      .then((doc) => {
        console.log("received DOC", doc);
        return doc;
      }); //this.documentStore.setDocument(doc)
  }

  async checkSlug(slug, type, docid) {
    let query = `_type=="${type}"&&slug.current=="${slug}"`;
    if (docid) {
      query += `&&_id!="${docid}"`;
    }
    let docs = await this.documentQuery(query);
    if (docs.length) return false;
    return true;
  }

  async documents(documentType, options) {
    if (!options) options = {};
    if (!options.order) {
      options.order = {
        by: "_updatedAt",
        desc: true,
      };
    }
    return this.documentQuery(`_type=="${documentType}"`, options);
  }

  async documentQuery(query, options) {
    return this.query(`*(${query})`, options).then(
      (resp) => resp.result
      // resp.result.map((doc) => this.documentStore.document(doc))
    );
  }

  admin_get_users() {
    let q = `query{
            allUser{
              _id
              name
              email
              role
            }
          }`;
    return this.graphql(q);
  }

  xxxblock_to_text(block) {
    if (!Array.isArray(block)) return block;
    console.log("$ block=>text", block);
    let text = [];
    block.forEach((b) => {
      if (b.children) text.push(this.block_to_text(b.children));
      if (b.text) text.push(b.text);
    });
    return text.join(" ").trim();
  }

  block_to_text(blocks) {
    if (!Array.isArray(blocks)) return blocks;
    return blocks
      .map((block) =>
        block._type !== "block" || !block.children
          ? ""
          : block.children.map((child) => child.text).join(" ")
      )
      .join("\n\n");
  }
}

export default new Api();
