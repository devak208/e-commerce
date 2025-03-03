const db = require("../config/db")
const fs = require("fs")
const path = require("path")

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products")
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message })
  }
}

// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE category_id = ?", [req.params.categoryId])
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products by category", error: error.message })
  }
}

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id])
    if (rows.length === 0) return res.status(404).json({ message: "Product not found" })
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details", error: error.message })
  }
}

// Create Product (Admin)
exports.createProduct = async (req, res) => {
  console.log("🛠️ Raw Body:", req.body)
  console.log("🖼️ Uploaded Files:", req.files)

  // Extract data from form fields (using a similar cleanup if needed)
  let name, price, description, stock, category_id, weight, qty
  Object.keys(req.body).forEach((key) => {
    const cleanKey = key.replace(/"/g, "")
    if (cleanKey === "name") name = req.body[key]
    if (cleanKey === "price") price = req.body[key]
    if (cleanKey === "description") description = req.body[key]
    if (cleanKey === "stock") stock = req.body[key]
    if (cleanKey === "category_id") category_id = req.body[key]
    if (cleanKey === "weight") weight = req.body[key]
    if (cleanKey === "qty") qty = req.body[key]
  })
  if (name && typeof name === "string") name = name.replace(/^"|"$/g, "")
  if (description && typeof description === "string") description = description.replace(/^"|"$/g, "")

  // Gather file names from req.files array (if any)
  const images = req.files ? req.files.map((file) => file.filename) : []

  // Validate required fields
  if (!name || !price || !description || !stock || !category_id) {
    return res.status(400).json({
      message: "All fields are required",
      received: { name, price, description, stock, category_id, weight, qty },
    })
  }

  try {
    // Store images as a JSON string (you can later parse it on the frontend)
    const imagesJSON = JSON.stringify(images)
    const [result] = await db.query(
      "INSERT INTO products (name, price, description, stock, category_id, image, weight, qty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, price, description, stock, category_id, imagesJSON, weight || 0, qty || 0],
    )

    res.status(201).json({
      id: result.insertId,
      name,
      price,
      description,
      stock,
      category_id,
      image: images,
      weight: weight || 0,
      qty: qty || 0,
      imageUrl: images.length ? images.map((img) => `/uploads/${img}`) : null,
    })
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message })
  }
}

// Update Product (Admin)
exports.updateProduct = async (req, res) => {
  console.log("🛠️ Update Raw Body:", req.body)
  let name, price, description, stock, category_id, weight, qty, imagesToRemove

  Object.keys(req.body).forEach((key) => {
    const cleanKey = key.replace(/"/g, "")
    if (cleanKey === "name") name = req.body[key]
    if (cleanKey === "price") price = req.body[key]
    if (cleanKey === "description") description = req.body[key]
    if (cleanKey === "stock") stock = req.body[key]
    if (cleanKey === "category_id") category_id = req.body[key]
    if (cleanKey === "weight") weight = req.body[key]
    if (cleanKey === "qty") qty = req.body[key]
    if (cleanKey === "imagesToRemove") {
      try {
        imagesToRemove = JSON.parse(req.body[key])
      } catch (e) {
        console.error("Error parsing imagesToRemove:", e)
      }
    }
  })
  if (name && typeof name === "string") name = name.replace(/^"|"$/g, "")
  if (description && typeof description === "string") description = description.replace(/^"|"$/g, "")

  // Gather new images if any
  const newImages = req.files ? req.files.map((file) => file.filename) : []

  // Validate required fields
  if (!name || !price || !description || !stock || !category_id) {
    return res.status(400).json({
      message: "All fields are required",
      received: { name, price, description, stock, category_id, weight, qty },
    })
  }

  try {
    // First, get the current product to access its images
    const [currentProduct] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id])

    if (currentProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" })
    }

    let currentImages = []
    try {
      if (currentProduct[0].image) {
        if (typeof currentProduct[0].image === "string" && currentProduct[0].image.startsWith("[")) {
          currentImages = JSON.parse(currentProduct[0].image)
        } else if (typeof currentProduct[0].image === "string") {
          currentImages = [currentProduct[0].image]
        } else if (Array.isArray(currentProduct[0].image)) {
          currentImages = currentProduct[0].image
        }
      }
    } catch (e) {
      console.error("Error parsing current product images:", e)
    }

    // Remove images that should be deleted
    if (imagesToRemove && imagesToRemove.length > 0) {
      // Filter out images that should be removed
      currentImages = currentImages.filter((img) => !imagesToRemove.includes(img))

      // Delete the actual image files
      imagesToRemove.forEach((filename) => {
        const filePath = path.join(__dirname, "../uploads", filename)
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            console.log(`Deleted image: ${filename}`)
          }
        } catch (err) {
          console.error(`Error deleting image ${filename}:`, err)
        }
      })
    }

    // Combine existing images with new ones
    const updatedImages = [...currentImages, ...newImages]

    // Limit to 4 images if there are more
    const finalImages = updatedImages.slice(0, 4)
    const imagesJSON = JSON.stringify(finalImages)

    // Update the product in the database
    const [result] = await db.query(
      "UPDATE products SET name = ?, price = ?, description = ?, stock = ?, category_id = ?, image = ?, weight = ?, qty = ? WHERE id = ?",
      [name, price, description, stock, category_id, imagesJSON, weight || 0, qty || 0, req.params.id],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({
      message: "Product updated successfully",
      product: {
        id: req.params.id,
        name,
        price,
        description,
        stock,
        category_id,
        image: finalImages,
        weight: weight || 0,
        qty: qty || 0,
        imageUrl: finalImages.length ? finalImages.map((img) => `/uploads/${img}`) : undefined,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message })
  }
}

// Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    // First, get the product to access its images
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id])

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Delete the product from the database
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [req.params.id])

    // Delete associated image files
    let images = []
    try {
      if (product[0].image) {
        if (typeof product[0].image === "string" && product[0].image.startsWith("[")) {
          images = JSON.parse(product[0].image)
        } else if (typeof product[0].image === "string") {
          images = [product[0].image]
        } else if (Array.isArray(product[0].image)) {
          images = product[0].image
        }
      }
    } catch (e) {
      console.error("Error parsing product images:", e)
    }

    // Delete each image file
    images.forEach((filename) => {
      const filePath = path.join(__dirname, "../uploads", filename)
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`Deleted image: ${filename}`)
        }
      } catch (err) {
        console.error(`Error deleting image ${filename}:`, err)
      }
    })

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message })
  }
}

