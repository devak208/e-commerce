const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/categories/categoryController");
const upload = require("../../middleware/Uploads/upload"); // your multer configuration

// GET all categories
router.get("/", categoryController.getAllCategories);

// POST to create a category with an image
router.post("/", upload.single("image"), categoryController.createCategory);

// PUT to update a category (name and image)
router.put("/:id", upload.single("image"), categoryController.updateCategory);

// DELETE a category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
