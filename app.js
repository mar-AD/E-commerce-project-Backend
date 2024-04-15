const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

const PORT = 7000;

const bodyParser = require("body-parser");
require("dotenv").config();
const MongoConnect = process.env.MONGO_CON;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
async function connected() {
  try {
    mongoose.connect(MongoConnect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }
}
connected();

const customers = require("./routes/Customers/CustomerRoutes");
app.use("/v1", customers);

const user = require("./routes/Users/usersRoutes");
app.use("/v1", user);

const categories = require("./routes/Categories/categoriesRoutes");
app.use("/v1", categories);

const subcategories = require("./routes/Subcategories/SubcategoryRouter");
app.use("/v1", subcategories);

const orders = require("./routes/Orders/OrdersRoutes");
app.use("/v1", orders);

const products = require("./routes/Products/ProductsRouter");
app.use("/v1", products);

mongoose.connection.on("connected", () => {
  console.log("connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
