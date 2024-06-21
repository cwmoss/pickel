import api from "../../lib/slow-hand.js";

export const get_document = (element) => {
  return element.closest("sh-editor").container.get_updated_data();
};

export { api };
