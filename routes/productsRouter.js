const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController.js");
const AMauthorization = require("../middlewares/authAM.js");
const upload = require("../middlewares/cloudinary.js");

router.post(
  "/products",
  upload.single("product_image"),
  productsController.createProduct
);

router.get("/allproducts", productsController.findProducts);

router.get("/products/:id", productsController.getProductById);

router.patch(
  "/products/:id",
  upload.single("productImage"),
  productsController.updateProduct
);

router.delete("/products/:id", productsController.removeProduct);

module.exports = router;
