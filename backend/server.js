const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")

const productRoutes = require("./routes/products/productRoutes")
const categoryRoutes = require("./routes/categories/categoryRoutes")
const bannerRoutes = require("./routes/Banner/bannerRoutes")

const app = express()

// CORS Options: Allow all origins
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

// Important: Parse URL-encoded form data BEFORE JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// API Routes
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/banners", bannerRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
  })
  res.status(500).json({ message: "Internal Server Error", error: err.message })
})

const PORT = process.env.PORT || 6000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
