"use client"

import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export function UserProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
      }
    }

    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Login function
  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  // Add item to cart
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((item) => item.id === product.id)

      let newItems
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        newItems = [...prevCart.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        }
      } else {
        // Add new item
        newItems = [...prevCart.items, { ...product, quantity }]
      }

      // Calculate new total
      const newTotal = newItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

      return { items: newItems, total: newTotal }
    })
  }

  // Update cart item quantity
  const updateCartItemQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => (item.id === productId ? { ...item, quantity } : item))

      // Calculate new total
      const newTotal = newItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

      return { items: newItems, total: newTotal }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== productId)

      // Calculate new total
      const newTotal = newItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)

      return { items: newItems, total: newTotal }
    })
  }

  // Clear cart
  const clearCart = () => {
    setCart({ items: [], total: 0 })
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        cart,
        isLoading,
        login,
        logout,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}

