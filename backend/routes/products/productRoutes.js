const express = require("express")
const router = express.Router()
const productController = require("../../controllers/products/productController")
const upload = require("../../middleware/Uploads/upload")

// Routes: Allow up to 4 images via field name "image"
router.get("/", productController.getAllProducts)
router.get("/category/:categoryId", productController.getProductsByCategory)
router.get("/:id", productController.getProductById)
router.post("/", upload.array("image", 4), productController.createProduct)
router.put("/:id", upload.array("image", 4), productController.updateProduct)
router.delete("/:id", productController.deleteProduct)

module.exports = router

