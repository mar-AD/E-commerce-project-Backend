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

const customers = require("./routes/CustomerRoutes.js");
app.use("/v1", customers);

const user = require("./routes/usersRoutes.js");
app.use("/v1", user);

const categories = require("./routes/categoriesRoutes.js");
app.use("/v1", categories);

const subcategories = require("./routes/subcategoryRouter.js");
app.use("/v1", subcategories);

const orders = require("./routes/ordersRoutes.js");
app.use("/v1", orders);

const products = require("./routes/productsRouter.js");
app.use("/v1", products);

mongoose.connection.on("connected", () => {
  console.log("connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});