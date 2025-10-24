import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/slices/authSlice'
import UserAvatar from '../components/UserAvatar'
import ActivityLog from '../components/ActivityLog'

export default function AdminDashboard() {
  const user = useSelector(selectUser)
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [activeTab, setActiveTab] = useState('users') // users | logs

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    setUsers(registeredUsers)
  }

  const deleteUser = (email) => {
    if (window.confirm(`Bạn có chắc muốn xóa user ${email}?`)) {
      const updatedUsers = users.filter(u => u.email !== email)
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
    }
  }

  const updateUserRole = (email, newRole) => {
    const updatedUsers = users.map(u => 
      u.email === email ? { ...u, role: newRole } : u
    )
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setEditingUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔐 Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Chào mừng, <span className="font-semibold text-purple-600">{user.name}</span> 
            {" "}(Role: <span className="font-semibold">{user.role}</span>)
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'users'
                  ? 'text-purple-600 border-b-4 border-purple-600 -mb-[2px]'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👥 Quản lý Users
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'logs'
                  ? 'text-purple-600 border-b-4 border-purple-600 -mb-[2px]'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Activity Logs
            </button>
          </div>

          {activeTab === 'users' && (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-3">Quyền hạn của Admin</h2>
                <ul className="space-y-2">
                  <li>✅ Quản lý tất cả người dùng trong hệ thống</li>
              <li>✅ Thay đổi role của người dùng (User, Moderator, Admin)</li>
              <li>✅ Xóa người dùng khỏi hệ thống</li>
              <li>✅ Xem thống kê và báo cáo hệ thống</li>
              <li>✅ Truy cập tất cả các trang và chức năng</li>
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
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Hành động</th>
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
                      {editingUser === u.email ? (
                        <select
                          className="border rounded px-2 py-1"
                          defaultValue={u.role || 'user'}
                          onChange={(e) => updateUserRole(u.email, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          u.role === 'admin' ? 'bg-red-200 text-red-800' :
                          u.role === 'moderator' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() => setEditingUser(editingUser === u.email ? null : u.email)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm"
                      >
                        {editingUser === u.email ? 'Hủy' : 'Sửa Role'}
                      </button>
                      <button
                        onClick={() => deleteUser(u.email)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        disabled={u.email === user.email}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-8">Chưa có người dùng nào</p>
          )}
            </>
          )}

          {activeTab === 'logs' && (
            <ActivityLog />
          )}
        </div>
      </div>
    </div>
  )
}
