const express = require("express");
const router = express.Router();
const subcategoryController = require("../../controllers/subcategoriesController");
const AMauthorization = require("../../middlewares/authAM");

router.post("/Subcategories", subcategoryController.creatSubcategory);

router.get("/Subcategories", subcategoryController.searchForSubcategory);

router.get("/Subcategories/:id", subcategoryController.getById);

router.put("/Subcategories/:id", subcategoryController.updateSubcategory);

router.delete("/Subcategories/:id", subcategoryController.deleteSub);

module.exports = router;
