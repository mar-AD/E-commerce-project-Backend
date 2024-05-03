const express = require("express");
const Product = require("../models/products.js");
const Subcategories = require("../models/subcategories.js");
const mongoose = require("mongoose");
const xss = require("xss");
const validateUserInput = require("../middlewares/validationMiddleware.js");

// create products ==========================

async function createProduct(req, res) {
  try {
    const {
      sku,
      productName,
      subcategoryID,
      shortDescription,
      longDescription,
      price,
      discountPrice,
      options,
    } = req.body;
    const skuu = xss(sku);
    const product_name = xss(productName);
    const short_description = xss(shortDescription);
    const long_description = xss(longDescription);
    const prices = xss(price);
    const discount_price = xss(discountPrice);
    const Options = xss(options);
    const productImage = req.file ? req.file.path : null;
    if (!mongoose.Types.ObjectId.isValid(subcategoryID)) {
      return res.status(400).json({ error: "Invalid subcategory ID" });
    }
    const validationErrors = validateUserInput.validateProducts(
      productName,
      shortDescription,
      longDescription,
      price
    );
    if (validationErrors.length > 0) {
      return res.status(400).json({ err: validationErrors });
    }
    const findProduct = await Product.findOne({ sku: sku });
    if (findProduct) {
      return res.status(401).json({ error: "This product already exists" });
    }

    const subcategory = await Subcategories.findOne({ _id: subcategoryID });
    if (!subcategory) {
      return res.status(404).json("This subcategory is not found");
    }
    const creation = new Product({
      sku: skuu,
      product_image: productImage,
      product_name: product_name,
      subcategory_id: subcategoryID,
      short_description: short_description,
      long_description: long_description,
      price: prices,
      discount_price: discount_price,
      options: Options,
    });

    await creation.save();
    res
      .status(201)
      .json({ message: `Product successfully created`, product: creation });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
}

//list and search for products ==========================

async function findProducts(req, res) {
  try {
    // const page = req.query.page || 1;
    const query = req.query.query || "";
    // const perPage = 3;
    const searchAll = await Product
      .aggregate([
        // {$skip:(page - 1) * perPage},
        // {$limit: perPage},
        { $match: { product_name: { $regex: query, $options: "i" } } },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategory_id",
            foreignField: "_id",
            as: "subName",
          },
        },
        {
          $unwind: "$subName",
        },
        {
          $lookup: {
            from: "categories",
            localField: "subName.category_id",
            foreignField: "_id",
            as: "categoryNm",
          },
        },
        {
          $unwind: "$categoryNm",
        },
        {
          $project: {
            _id: 1,
            sku: 1,
            product_image: 1,
            product_name: 1,
            categoryName: "$categoryNm.category_name",
            short_description: 1,
            long_description: 1,
            price: 1,
            discount_price: 1,
            options: 1,
            active: 1,
            createdAt: 1,
          },
        },
      ])
      .exec();
    if (!searchAll) {
      return res.status(404).json("not found");
    } else {
      return res.status(200).json(searchAll);
    }
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
}

// get the product by ID=================================

async function getProductById(req, res) {
  try {
    const Idd = req.params.id;
    const productId = new mongoose.Types.ObjectId(Idd);
    const findPro = await Product
      .aggregate([
        { $match: { _id: productId } },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategory_id",
            foreignField: "_id",
            as: "subName",
          },
        },
        {
          $unwind: "$subName",
        },
        {
          $project: {
            _id: 1,
            sku: 1,
            product_image: 1,
            product_name: 1,
            subcategoryName: "$subName.subcategory_name",
            short_description: 1,
            long_description: 1,
            price: 1,
            discount_price: 1,
            options: 1,
            active: 1,
          },
        },
      ])
      .exec();
    if (!findPro) {
      res.status(404).json("products not found");
    }
    res.status(200).json(findPro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// update product by ID =================================

async function updateProduct(req, res) {
  try {
    const {
      sku,
      productName,
      skusubcategoryID,
      shortDescription,
      longDescription,
      price,
      discountPrice,
      options,
    } = req.body;

    let updateData = {
      product_name: productName,
      sku: sku,
      skusubcategory_id: skusubcategoryID,
      short_description: shortDescription,
      long_description: longDescription,
      price: price,
      discount_price: discountPrice,
      options: options,
    };

    if (req.file) {
      updateData.product_image = req.file.path;
    }

    const proId = req.params.id;
    const UpdateProduct = await Product.findByIdAndUpdate(proId, updateData);

    if (!UpdateProduct) {
      res.status(404).json("Product not found");
    }

    res.status(200).send("Product updated successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//delete product by id================================
async function removeProduct(req, res) {
  try {
    const pId = req.params.id;
    const isThere = await Product.findByIdAndRemove(pId);
    if (!isThere) {
      res.status(404).json("this product is not exicte");
    } else {
      res.status(200).json("product deleted successfully");
    }
  } catch (error) {
    res.status(200).json({ err: error.message });
  }
}

module.exports = {
  createProduct: createProduct,
  findProducts: findProducts,
  getProductById: getProductById,
  updateProduct: updateProduct,
  removeProduct: removeProduct,
};
