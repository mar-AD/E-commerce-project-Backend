const express = require('express');
const router = express.Router();
const productsController = require('../../Controllers/productsController')
const AMauthorization = require('../../middlewares/AuthAM')
const upload = require('../../middlewares/Cloudinary')

router.post('/products',upload.single('product_image'), productsController.createProduct)

router.get('/allproducts', productsController.findProducts)

// router.get('/produc', productsController.searchProducts)

router.get('/products/:id', productsController.getProductById)

router.patch('/products/:id',upload.single('productImage'), productsController.updateProduct)

router.delete('/products/:id', productsController.removeProduct)
// router.get('/products/sorts', productsController.sortProducts)

module.exports = router