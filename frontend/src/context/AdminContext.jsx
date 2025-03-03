"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")
    const adminData = localStorage.getItem("adminData")

    if (token && adminData) {
      setAdmin(JSON.parse(adminData))
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const login = (adminData, token) => {
    localStorage.setItem("adminToken", token)
    localStorage.setItem("adminData", JSON.stringify(adminData))
    setAdmin(adminData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    setAdmin(null)
    setIsAuthenticated(false)
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}

