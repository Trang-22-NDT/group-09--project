import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../redux/slices/authSlice'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useSelector(selectAuth)

  // Helper function to check if user has required role
  const hasRole = (roles) => {
    if (!user) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-100 to-red-200">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-[500px] text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Truy cập bị từ chối</h2>
          <p className="text-gray-700 mb-6">
            Bạn không có quyền truy cập trang này.
            <br />
            Role hiện tại: <span className="font-semibold">{user.role}</span>
          </p>
          <a 
            href="/profile" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Về trang Profile
          </a>
        </div>
      </div>
    )
  }

  return children
}
