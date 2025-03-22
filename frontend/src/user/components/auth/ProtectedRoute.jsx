import { Navigate } from "react-router-dom"
import { useUser } from "../../../context/UserContext"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, isLoading } = useUser()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If adminOnly and user is not admin, redirect to home
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />
  }

  // Otherwise, render the protected content
  return children
}

