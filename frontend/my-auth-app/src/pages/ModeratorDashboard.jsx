import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/slices/authSlice'
import UserAvatar from '../components/UserAvatar'

export default function ModeratorDashboard() {
  const user = useSelector(selectUser)
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    // Moderator chỉ xem được user bình thường, không xem admin
    const filteredUsers = registeredUsers.filter(u => u.role !== 'admin')
    setUsers(filteredUsers)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ⚡ Moderator Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Chào mừng, <span className="font-semibold text-orange-600">{user.name}</span> 
            {" "}(Role: <span className="font-semibold">{user.role}</span>)
          </p>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Quyền hạn của Moderator</h2>
            <ul className="space-y-2">
              <li>✅ Xem danh sách người dùng bình thường</li>
              <li>✅ Kiểm duyệt nội dung và bình luận</li>
              <li>✅ Quản lý báo cáo từ người dùng</li>
              <li>✅ Hỗ trợ người dùng giải quyết vấn đề</li>
              <li>❌ Không thể xem hoặc chỉnh sửa thông tin Admin</li>
              <li>❌ Không thể thay đổi role của người dùng</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Danh sách người dùng ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Avatar</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Tên</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Email</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Role</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <UserAvatar user={u} size="sm" />
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{u.name}</td>
                    <td className="border border-gray-300 px-4 py-3">{u.email}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        u.role === 'moderator' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <span className="text-green-600 font-semibold">Hoạt động</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">Chưa có người dùng nào</p>
          )}

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Lưu ý:</strong> Moderator không thể xem hoặc chỉnh sửa thông tin của Admin. 
              Chỉ có thể xem và quản lý người dùng bình thường.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
