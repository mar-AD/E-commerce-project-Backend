const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customers.js");
const Order = require("../models/orders.js");

require("dotenv").config();
const secretKey = process.env.TOKEN_KEY;
const refreshKey = process.env.REFRESH_KEY;

// create Order===================================
async function createOrder(req, res) {
  try {
    const { customerId, orderItems, cartTotalPrice } = req.body;
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token verification failed" });
      }
      const customer = await Customer.findById(decoded.customerid);

      if (!customer) {
        return res
          .status(403)
          .json({ error: "Email validation required to create an order." });
      }

      if (customer._id.toString() !== customerId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: customerId does not match token." });
      }
      const newOrder = new Order({
        status: "Open",
        order_date: new Date(),
        customer_id: customerId,
        order_items: orderItems,
        cart_total_price: cartTotalPrice,
      });
      await newOrder.save();
      res
        .status(201)
        .json({ message: "Order created successfully.", order: newOrder });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}

//list and search for Order =======================================

async function allOrder(req, res) {
  try {
    // const page = req.query.page || 1;
    // const forPage = 10;
    const findorders = await Order.aggregate([
      // { $skip: (page - 1) * forPage },
      // { $limit: forPage },
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $project: {
          _id: 1,
          first_name: "$customer.first_name",
          last_name: "$customer.last_name",
          order_items: 1,
          order_date: 1,
          status: 1,
          cart_total_price: 1,
        },
      },
    ]).exec();

    if (!findorders) {
      return res.status(404).json("No orders with that name found");
    } else {
      return res.status(200).json(findorders);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

//get Order by ID ============================

async function orderById(req, res) {
  const orderid = req.params.id;
  const orders = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderid),
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: { path: "$customer", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        first_name: "$customer.first_name",
        last_name: "$customer.last_name",
        order_items: 1,
        order_date: 1,
        status: 1,
        cart_total_price: 1,
      },
    },
  ]).exec();
  if (!orders) {
    return res.status(404).json("No orders found");
  } else {
    return res.status(200).json(orders);
  }
}

//update Order by ID ============================

async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json("No order with that ID found");
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getorders(req, res) {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
          count: { $sum: 1 },
        },
      },
    ]).sort("_id");

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

async function getallorders(req, res) {
  try {
    const order = await Order.countDocuments({});
    res.json({ count: order });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

async function getTotalPrice(req, res) {
  try {
    const orders = await Order.find({ status: "Delivered" });
    console.log(orders);
    const sum = orders.reduce((one, order) => one + order.cart_total_price, 0);
    res.json(sum);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

module.exports = {
  createOrder: createOrder,
  allOrder: allOrder,
  orderById: orderById,
  updateOrder: updateOrder,
  getorders: getorders,
  getallorders: getallorders,
  getTotalPrice: getTotalPrice,
};
