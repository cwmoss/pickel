import { defineStore } from 'pinia'

export const useDocumentStore = defineStore('document', {
  state: () => ({
  }),

  getters: {

  },

  actions: {
    document(document) { // async
      if(!document) return document;
      if(this[document._id]){
        setTimeout(() => {
          Object.assign(this[document._id], document);
        })
      }else{
        this[document._id] = document;
      }
      // this[document._id] = document;
      // console.log('ACCESS DOCUMENT STORE', this[document._id])
      return this[document._id];
    },
    setDocument(document){ // sync
      if(!document) return document;
      if(this[document._id]){
        Object.assign(this[document._id], document);
      }else{
        this[document._id] = document;
      }
      // this[document._id] = document;
      // console.log('ACCESS DOCUMENT STORE', this[document._id])
      return this[document._id];
    },
    deleteDocument(document){
      delete this[document._id];
    }
  }
})
