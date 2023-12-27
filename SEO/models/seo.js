const { Schema, model } = require("mongoose");

const Seo = new Schema({
  userPersonal: Object,
  subcategory: Object,
  search: Object,
  index: Object,
  flavoring: Object,
  cooperation: Object,
  contacts: Object,
  about: Object
});
module.exports = model("Seo", Seo);