/*
Object.assign(document.createElement('a'), {
    id: 'id',
    class: 'whatever class',
    href: 'https://www.google.com/',
    innerHTML: 'This is a link'
  });

  https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
*/

let toldYouSo = (eMaker, head, ...fam) => {
    head = eMaker(head);
     fam.forEach(c=>{head.appendElement(eMaker(c));
      return head;
    })

    (tagData=>object.assign(document.createElement(tagData.tag, tagData), 
    {tag: "div", className: "check"}, 
    {tag: "input", type: "checkbox", name: "buy", value: "260", 
    checked: "", onclick: "javascript:basked.checkItem();"})
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstElementChild;
  }
  * @param {String} HTML representing a single element.
  * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
  * @return {Element | HTMLCollection | null}
  */
 function fromHTML(html, trim = true) {
   // Process the HTML string.
   html = trim ? html.trim() : html;
   if (!html) return null;
 
   // Then set up a new template element.
   const template = document.createElement('template');
   template.innerHTML = html;
   const result = template.content.children;
 
   // Then return either an HTMLElement or HTMLCollection,
   // based on whether the input HTML had one or more roots.
   if (result.length === 1) return result[0];
   return result;
 }

// schema
 async xxload(schema, name) {
  console.log("$$ set schema (load)", schema, name);
  this.schema = schema;
  this.name = name;
  let previews = await import("../../schema/" + name + "/preview.js").catch(
    (e) => {
      console.warn("no previews for schema", name);
      return { default: {} };
    }
  );
  this.previews = previews.default;
  console.log("previews", this.previews);
}