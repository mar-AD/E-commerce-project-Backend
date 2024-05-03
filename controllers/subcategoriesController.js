
const mongoose = require("mongoose");

const subcategories = require("../models/subcategories.js");
const categories = require("../models/categories.js");
const products = require("../models/products.js");
require("dotenv").config();
const secretKey = process.env.TOKEN_KEY;
const refreshKey = process.env.REFRESH_KEY;

// create subcategoreis===================================
async function creatSubcategory(req, res) {
  try {
    const { SubcategoryName, categoryId } = req.body;
    const Subcategory = await subcategories.findOne({
      subcategory_name: SubcategoryName,
    });
    if (Subcategory) {
      return res.status(400).json("subcategory name already exists");
    } else {
      const category = await categories.findById({ _id: categoryId });
      if (!category) {
        return res.status(401).send("Category not found");
      }
      const createSub = new subcategories({
        subcategory_name: SubcategoryName,
        category_id: categoryId,
      });
      await createSub.save();
      res.status(200).json({ createSub: createSub });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

//list and search for subcategoreis =======================================

async function searchForSubcategory(req, res) {
  try {
    // const page = req.query.page || 1;
    // const forPage = 10;
    const query = req.query.query || "";
    const findSubcategoreis = await subcategories
      .aggregate([
        // { $skip: (page - 1) * forPage },
        {
          $match: {
            subcategory_name: { $regex: query, $options: "i" },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            _id: 1,
            subcategory_name: 1,
            categoryName: "$category.category_name",
          },
        },
        // { $limit: forPage },
      ])
      .exec();
    if (!findSubcategoreis || findSubcategoreis.length === 0) {
      return res.status(404).json("No subcategories with that name found");
    } else {
      return res.status(200).json(findSubcategoreis);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

//get subcategoreis by ID ============================

async function getById(req, res) {
  const IDSub = req.params.id;
  const findSub = await subcategories
    .aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(IDSub),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          subcategory_name: 1,
          categoryName: "$category.category_name",
        },
      },
    ])
    .exec();
  if (!findSub) {
    return res.status(404).json("No subcategories found");
  } else {
    return res.status(200).json(findSub);
  }
}

//update subcategoreis by ID ============================

async function updateSubcategory(req, res) {
  try {
    const idSub = req.params.id;
    const { subcategoryName, categoryId, Active } = req.body;

    const categoryExists = await categories.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json("No category with that ID found");
    }

    const updatedSubcategory = await subcategories.findByIdAndUpdate(
      idSub,
      {
        subcategory_name: subcategoryName,
        category_id: categoryId,
        active: Active,
      },
      { new: true } // This option ensures that the updated document is returned
    );

    if (!updatedSubcategory) {
      return res.status(404).json("No subcategory with that ID found");
    } else {
      res.status(200).json("The subcategory has been updated successfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

//delete subcategoreis by ID ============================

// const Subcategory = require('../models/subcategory');
// const Product = require('../models/product');

async function deleteSub(req, res) {
  try {
    const subcategoryId = req.params.id;
    const subcategory = await subcategories.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json("This subcategory does not exist");
    }

    const productsAttached = await products.find({
      subcategory_id: subcategoryId,
    });

    if (productsAttached.length > 0) {
      return res
        .status(400)
        .json("Products are attached, cannot delete this subcategory");
    }
    await subcategories.findByIdAndRemove(subcategoryId);

    res.status(200).json("Subcategory deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

module.exports = {
  creatSubcategory: creatSubcategory,
  searchForSubcategory: searchForSubcategory,
  getById: getById,
  updateSubcategory: updateSubcategory,
  deleteSub: deleteSub,
};
