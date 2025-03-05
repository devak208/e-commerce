const db = require('../../config/db');

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new category with an image
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  // Use the uploaded file's filename, if available
  const image = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      "INSERT INTO categories (name, image) VALUES (?, ?)",
      [name, image]
    );
    res.status(201).json({ id: result.insertId, name, image });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a category (name and image)
exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    let query = "UPDATE categories SET name = ?";
    const params = [name];

    // Only update image if provided
    if (image !== null) {
      query += ", image = ?";
      params.push(image);
    }

    query += " WHERE id = ?";
    params.push(req.params.id);

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a category
exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
