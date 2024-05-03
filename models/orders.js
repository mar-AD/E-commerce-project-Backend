const mongoose = require("mongoose");
// ORDERS schema ======================================================

const ordersSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  order_items: {
    type: Array,
    required: true,
  },
  order_date: {
    type: Date,
    required: true,
  },
  cart_total_price: {
    type: Number,
    min: 0,
  },
  status: {
    type: String,
  },
});

const orders = mongoose.model("Orders", ordersSchema);

module.exports = orders;

