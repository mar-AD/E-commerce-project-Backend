const express = require('express');
const router = express.Router();
const subcategoryController = require('../../controllers/SubcategoriesController')
const AMauthorization = require('../../middlewares/AuthAM')

router.post('/Subcategories', subcategoryController.creatSubcategory)

router.get('/Subcategories', subcategoryController.searchForSubcategory)

router.get('/Subcategories/:id', subcategoryController.getById)

router.put('/Subcategories/:id', subcategoryController.updateSubcategory)

router.delete('/Subcategories/:id', subcategoryController.deleteSub)

module.exports = router