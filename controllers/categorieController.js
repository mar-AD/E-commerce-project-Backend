const express = require("express");
const Categorie = require("../models/categories");
const Subcategories = require("../models/subcategories");

async function createCategories(req, res) {
  try {
    const { category_name } = req.body;

    const categorie = await Categorie.findOne({
      category_name: category_name,
    });
    if (categorie) {
      return res
        .status(400)
        .json(`the category ${category_name} already exist`);
    } else {
      let newCategory = new Categorie({
        category_name: category_name,
      });
      newCategory.save();
      return res.status(200).json("category created successfully");
    }
    
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function searchCategories(req, res) {
  // const page = req.query.page || 1;
  // const singlePage = req.query.size || 10;
  const query = req.query.query || "";
  try {
    const categories = await Categorie.find({
      category_name: new RegExp(query, "i"),
    })
      // .skip((page - 1) * singlePage)
      // .limit(singlePage);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
async function retrieveIdCategorie(req, res) {
  try {
    const categorie = await Categorie.findById(req.params.id);
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function updateCategorie(req, res) {
  const categorieid = req.params.id;
  const { category_name, active } = req.body;

  try {
    const categories = await Categorie.findByIdAndUpdate(categorieid, {
      category_name: category_name,
      active: active,
    });

    if (!categories) {
      throw new Error("No such Category");
    } else {
      categories.save();
      res.json("Category updated successfully");
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function deleteCategorie(req, res) {
  const categoryId = req.params.id;
  try {
    const category = await Categorie.findById(categoryId);
    if (!category) {
      return res.status(404).json({ status: 404, message: 'the catégorie ID is invalide' });
    }

    const subcategories = await Subcategories.find({category_id: categoryId});
    console.log(subcategories)
    if (subcategories.length > 0) {
      return res.status(400).json({
        status: 400,
        message: 'Unable to delete this category, subcategories are attached to it',
      });
    }else {

      await category.deleteOne();

      res.status(200).json({ status: 200, message: 'Catégorie supprimée avec succès' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Erreur interne du serveur' });
  }
}

module.exports = {
  createCategories: createCategories,
  searchCategories: searchCategories,
  retrieveIdCategorie: retrieveIdCategorie,
  updateCategorie: updateCategorie,
  deleteCategorie: deleteCategorie,
};
