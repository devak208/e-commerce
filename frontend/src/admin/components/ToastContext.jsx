"use client"

import { createContext, useContext, useState } from "react"
import Toast from "./Toast"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type }])
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }

  const handleClose = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container for all toasts in bottom-right corner */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={handleClose}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
