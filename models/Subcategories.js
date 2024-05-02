const mongoose = require("mongoose");
//Subcategories schema =========================================

const subcategoriesSchema = new mongoose.Schema({
  subcategory_name: {
    type: String,
    unique: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const subcategories = mongoose.model("Subcategories", subcategoriesSchema);

module.exports = subcategories;
