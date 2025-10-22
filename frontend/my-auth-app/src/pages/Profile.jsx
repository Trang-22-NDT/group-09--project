import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, hasRole } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-100 to-blue-200 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[600px]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Thông tin cá nhân
        </h2>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Họ và tên</label>
            <div className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
              {user.name}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Email</label>
            <div className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Role (Vai trò)</label>
            <div className={`w-full border-2 rounded-lg px-4 py-3 font-bold text-lg ${
              user.role === 'admin' ? 'bg-red-100 border-red-400 text-red-800' :
              user.role === 'moderator' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' :
              'bg-green-100 border-green-400 text-green-800'
            }`}>
              {user.role === 'admin' && '🔐 Admin'}
              {user.role === 'moderator' && '⚡ Moderator'}
              {user.role === 'user' && '👤 User'}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Quyền truy cập của bạn:</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {hasRole('admin') && (
              <>
                <li>✅ Truy cập Admin Dashboard</li>
                <li>✅ Quản lý tất cả người dùng</li>
                <li>✅ Thay đổi role người dùng</li>
              </>
            )}
            {hasRole(['admin', 'moderator']) && (
              <>
                <li>✅ Truy cập Moderator Dashboard</li>
                <li>✅ Xem danh sách người dùng</li>
              </>
            )}
            {hasRole('user') && (
              <li>✅ Truy cập Profile cá nhân</li>
            )}
          </ul>
        </div>

        <div className="flex gap-3">
          {hasRole('admin') && (
            <Link
              to="/admin"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition text-center"
            >
              🔐 Admin Dashboard
            </Link>
          )}
          {hasRole(['admin', 'moderator']) && (
            <Link
              to="/moderator"
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition text-center"
            >
              ⚡ Moderator Dashboard
            </Link>
          )}
        </div>

        <Link
          to="/"
          className="block mt-4 text-center text-gray-600 hover:text-gray-800 transition"
        >
          ← Về trang chủ
        </Link>
      </div>
    </div>
  )
}