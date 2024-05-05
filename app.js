const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 7000;

const bodyParser = require("body-parser");
require("dotenv").config();
const MongoConnect = process.env.MONGO_CON;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function connected() {
  try {
    await mongoose.connect(MongoConnect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connected();

// Serve static files for the dashboard frontend
app.use("/dashboard", express.static(path.join(__dirname, 'https://e-commerce-project-back-office.vercel.app/')));

// Serve static files for the store frontend
app.use("/store", express.static(path.join(__dirname, 'path_to_store_build')));

// Define API routes
const customers = require("./routes/customerRoutes.js");
const user = require("./routes/usersRoutes.js");
const categories = require("./routes/categoriesRoutes.js");
const subcategories = require("./routes/subcategoryRouter.js");
const orders = require("./routes/ordersRoutes.js");
const products = require("./routes/productsRouter.js");

app.use("/v1", customers);
app.use("/v1", user);
app.use("/v1", categories);
app.use("/v1", subcategories);
app.use("/v1", orders);
app.use("/v1", products);

// Catch-all route to serve the dashboard frontend
app.get('/dashboard*', (req, res) => {
  res.sendFile(path.join(__dirname, 'https://e-commerce-project-back-office.vercel.app/'));
});

// Catch-all route to serve the store frontend
app.get('/store*', (req, res) => {
  res.sendFile(path.join(__dirname, 'path_to_store_index.html'));
});

// Start the server
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
