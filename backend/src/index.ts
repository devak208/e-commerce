import * as cors from "cors"
import * as express from "express"
import { type NextFunction, type Request, type Response } from "express"
import * as morgan from "morgan"
import * as path from "path"
import "colors";
import bannerRoutes from "./routes/bannerRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import productRoutes from "./routes/productRoutes"

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
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// API Routes
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/banners", bannerRoutes)

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
  })
  res.status(500).json({ message: "Internal Server Error", error: err.message })
})

const PORT = process.env.PORT || 6000
app.listen(PORT, () => console.log("Server started on".blue, `PORT ${PORT}`.yellow));
