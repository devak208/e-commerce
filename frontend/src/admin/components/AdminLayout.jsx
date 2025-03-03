"use client"

import { useState } from "react"
import { useAdmin } from "../../context/AdminContext"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

export default function AdminLayout({ children }) {
  const { isLoading } = useAdmin() // Removed isAuthenticated check
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-gray-800 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      <div className="flex flex-col flex-1 lg:pl-64">
        <TopBar setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
