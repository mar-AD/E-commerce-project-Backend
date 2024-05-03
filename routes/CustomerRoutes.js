const express = require("express");
const customerRoute = require("../controllers/customerController.js");
const router = express.Router();
const AMauthorization = require("../middlewares/authAM.js");
const upload = require("../middlewares/cloudinary.js");

router.post(
  "/customers",
  upload.single("customer_image"),
  customerRoute.createCustomer
);

router.post("/customers/login", customerRoute.loginCustumer);

router.get("/customers", customerRoute.searchCustomer);

router.get("/customers/profile", customerRoute.profileCustomer);

router.get("/customers/:id", customerRoute.retrieveCustomer);

router.get("/customers/validate/:id", customerRoute.validateCustomer);

router.put("/customers/:id", customerRoute.updateCustomer);

router.delete("/customers/delete", customerRoute.deleteCustomer);

router.patch(
  "/customers/update/:id",
  upload.single("customer_image"),
  customerRoute.updateIdCustomer
);

router.get("/allcustomers/all", customerRoute.allCustomer);

module.exports = router;
