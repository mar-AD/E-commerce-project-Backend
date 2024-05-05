const express = require("express");
const customerController = require("../controllers/customerController.js");
const router = express.Router();
const AMauthorization = require("../middlewares/authAM.js");
const upload = require("../middlewares/cloudinary.js");

router.post(
  "/customers",
  upload.single("customer_image"),
  customerController.createCustomer
);

router.post("/customers/login", customerController.loginCustumer);

router.get("/customers", customerController.searchCustomer);

router.get("/customers/profile", customerController.profileCustomer);

router.get("/customers/:id", customerController.retrieveCustomer);

router.get("/customers/validate/:id", customerController.validateCustomer);

router.put("/customers/:id", customerController.updateCustomer);

router.delete("/customers/delete", customerController.deleteCustomer);

router.patch(
  "/customers/update/:id",
  upload.single("customer_image"),
  customerController.updateIdCustomer
);

router.get("/allcustomers/all", customerController.allCustomer);

router.post('/customers/password/reset',customerController.resetRquist)

router.get('/customers/password/reset/verify/:token', customerController.verifyResetToken)

router.post('/customers/password/reset/update/:token', customerController.setNewPass)

module.exports = router;
