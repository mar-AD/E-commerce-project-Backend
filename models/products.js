const mongoose = require("mongoose");

// products schema ======================================================

const productsSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
  },
  product_image: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
    unique: true,
  },
  subcategory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"subcategories",
    required: true,
  },
  short_description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  discount_price: {
    type: Number,
  },
  options: {
    type: Array,
  },
  active: {
    type: Boolean,
    default: false,
  },
},{timestamps: true});

const products = mongoose.model("Products", productsSchema);

module.exports = products;
