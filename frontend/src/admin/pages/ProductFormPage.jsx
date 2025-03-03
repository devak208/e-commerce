"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import AdminLayout from "../components/AdminLayout"
import PageHeader from "../components/PageHeader"
import { useToast } from "../components/ToastContext"

export default function ProductFormPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const queryParams = new URLSearchParams(search)
  const id = queryParams.get("id")

  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category_id: "",
    weight: "",
    qty: "",
    images: [],
    imagePreview: [],
    existingImages: [],
    imagesToRemove: [],
  })

  useEffect(() => {
    fetchCategories()
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      setCategories(response.data || [])

      // Set default category if adding a new product
      if (!id && response.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category_id: response.data[0].id,
        }))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      showToast("Failed to load categories", "error")
    }
  }

  const fetchProduct = async (productId) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`)
      const product = response.data

      // Parse product images if needed
      let productImages = []
      if (product.image) {
        try {
          if (typeof product.image === "string" && product.image.startsWith("[")) {
            productImages = JSON.parse(product.image)
          } else if (typeof product.image === "string") {
            productImages = [product.image]
          } else if (Array.isArray(product.image)) {
            productImages = product.image
          }
        } catch (e) {
          console.error("Error parsing product image:", e)
        }
      }

      setFormData({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        stock: product.stock || "",
        category_id: product.category_id || "",
        weight: product.weight || "",
        qty: product.qty || "",
        images: [],
        imagePreview: productImages.map((img) => `${import.meta.env.VITE_API_URL}/uploads/${img}`),
        existingImages: productImages,
        imagesToRemove: [],
      })
    } catch (error) {
      console.error("Error fetching product:", error)
      showToast("Failed to load product details", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // If we're editing and already have images, append new ones
      const newImagePreviews = files.map((file) => URL.createObjectURL(file))

      setFormData({
        ...formData,
        images: [...formData.images, ...files],
        imagePreview: [...formData.imagePreview, ...newImagePreviews],
      })
    }
  }

  const handleRemoveImage = (index) => {
    // If this is an existing image in edit mode
    if (id && index < (formData.existingImages?.length || 0)) {
      const imagesToRemove = [...(formData.imagesToRemove || [])]
      imagesToRemove.push(formData.existingImages[index])

      const newExistingImages = [...formData.existingImages]
      newExistingImages.splice(index, 1)

      const newImagePreview = [...formData.imagePreview]
      newImagePreview.splice(index, 1)

      setFormData({
        ...formData,
        existingImages: newExistingImages,
        imagePreview: newImagePreview,
        imagesToRemove,
      })
    } else {
      // This is a newly added image
      const newIndex = id ? index - (formData.existingImages?.length || 0) : index

      const newImages = [...formData.images]
      newImages.splice(newIndex, 1)

      const newImagePreview = [...formData.imagePreview]
      newImagePreview.splice(index, 1)

      setFormData({
        ...formData,
        images: newImages,
        imagePreview: newImagePreview,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("price", formData.price)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("stock", formData.stock)
    formDataToSend.append("category_id", formData.category_id)
    formDataToSend.append("weight", formData.weight || 0)
    formDataToSend.append("qty", formData.qty || 0)

    // Append each image file
    formData.images.forEach((image) => {
      formDataToSend.append("image", image)
    })

    // If editing, include the list of images to remove
    if (id && formData.imagesToRemove && formData.imagesToRemove.length > 0) {
      formDataToSend.append("imagesToRemove", JSON.stringify(formData.imagesToRemove))
    }

    try {
      if (id) {
        // Update existing product
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, formDataToSend)
        showToast("Product updated successfully", "success")
      } else {
        // Create new product
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formDataToSend)
        showToast("Product created successfully", "success")
      }

      // Navigate back to products list
      navigate("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      showToast(error.response?.data?.message || "Failed to save product", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title={id ? "Edit Product" : "Add Product"}
        description={id ? "Update product details" : "Create a new product"}
        actions={
          <button
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
        }
      />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category_id"
                id="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                min="0"
                step="0.01"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="qty" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="qty"
                id="qty"
                min="0"
                value={formData.qty}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            ></textarea>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Product Images (up to 4)
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                name="images"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="sr-only"
                disabled={formData.imagePreview.length >= 4}
              />
              <label
                htmlFor="images"
                className={`relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                  formData.imagePreview.length >= 4 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span>{id ? "Change images" : "Upload images"}</span>
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {formData.imagePreview.length >= 4
                  ? "Maximum 4 images allowed"
                  : formData.images.length > 0
                  ? `${formData.images.length} new image(s) selected`
                  : id
                  ? formData.imagePreview.length > 0
                    ? `${formData.imagePreview.length} existing image(s)`
                    : "No images"
                  : "No images selected"}
              </span>
            </div>
          </div>

          {formData.imagePreview.length > 0 && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview (click to remove)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-40 w-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {id ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
