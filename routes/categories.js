const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const userJwt = require("../helpers/userJwt");

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  res.status(200).send(category);
});

router.post("/", userJwt, async (req, res) => {
  try {
    const user = req.user;

    if (user.type === "Admin") {
      let category = await Category.findOne({ name: req.body.name });

      if (category) {
        return res.status(400).send("Category with given name already exists");
      } else {
        category = new Category({
          name: req.body.name,
        });

        category = await category.save();

        if (!category)
          return res.status(400).send("The category cannot be created!");

        res.send(category);
      }
    } else {
      return res
        .status(401)
        .send("You are not authorized to create a category");
    }
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", userJwt, async (req, res) => {
  try {
    const user = req.user;

    if (user.type === "Admin") {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
        },
        { new: true }
      );

      if (!category)
        return res.status(400).send("The category cannot be updated!");

      res.send(category);
    } else {
      return res
        .status(401)
        .send("You are not authorized to update a category");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", userJwt, async (req, res) => {
  try {
    const user = req.user;

    if (user.type === "Admin") {
      const category = await Category.findByIdAndRemove(req.params.id);

      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "The category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Category not found!" });
      }
    } else {
      return res
        .status(401)
        .send("You are not authorized to delete a category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
