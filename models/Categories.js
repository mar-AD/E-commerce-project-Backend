const mongoose = require("mongoose");

// Categories schema  ==================================================

const categoriesSchema = new mongoose.Schema({
  category_name: {
    type: String,
    unique: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const categories = mongoose.model("Categories", categoriesSchema);

module.exports = categories;
