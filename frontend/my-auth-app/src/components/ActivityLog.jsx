import React, { useState, useEffect } from 'react'
import api from '../api/axios'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, login, logout, failed_login
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs()
  }, [filter, page])

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Gọi API lấy logs
      const response = await api.get('/logs', {
        params: {
          action: filter !== 'all' ? filter : undefined,
          page,
          limit: 20
        }
      })
      
      setLogs(response.data.logs || response.data)
      setTotalPages(response.data.totalPages || 1)
      
    } catch (err) {
      console.error('Fetch logs error:', err)
      
      // Mock data nếu API chưa có
      const mockLogs = generateMockLogs()
      setLogs(mockLogs)
      setError('Đang sử dụng dữ liệu demo (API chưa sẵn sàng)')
      
    } finally {
      setLoading(false)
    }
  }

  const generateMockLogs = () => {
    const actions = ['login', 'logout', 'failed_login', 'register', 'update_profile', 'change_role']
    const users = ['admin@gmail.com', 'user@gmail.com', 'moderator@gmail.com', 'test@gmail.com']
    
    return Array.from({ length: 20 }, (_, i) => ({
      _id: `log-${i}`,
      userId: users[Math.floor(Math.random() * users.length)],
      action: filter !== 'all' ? filter : actions[Math.floor(Math.random() * actions.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      details: {
        status: Math.random() > 0.2 ? 'success' : 'failed'
      }
    }))
  }

  const getActionBadge = (action) => {
    const badges = {
      login: { color: 'bg-green-100 text-green-800 border-green-300', icon: '🔓', label: 'Login' },
      logout: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '🔒', label: 'Logout' },
      failed_login: { color: 'bg-red-100 text-red-800 border-red-300', icon: '❌', label: 'Failed Login' },
      register: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '📝', label: 'Register' },
      update_profile: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '✏️', label: 'Update Profile' },
      change_role: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '⚡', label: 'Change Role' }
    }
    
    const badge = badges[action] || { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '📋', label: action }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        {badge.icon} {badge.label}
      </span>
    )
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    // Nếu trong 1 phút
    if (diff < 60000) {
      return 'Vừa xong'
    }
    // Nếu trong 1 giờ
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes} phút trước`
    }
    // Nếu trong 1 ngày
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours} giờ trước`
    }
    
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Activity Logs
        </h2>
        <button
          onClick={fetchLogs}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('login')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'login' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔓 Login
        </button>
        <button
          onClick={() => setFilter('failed_login')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'failed_login' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ❌ Failed Login
        </button>
        <button
          onClick={() => setFilter('logout')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filter === 'logout' 
              ? 'bg-gray-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔒 Logout
        </button>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 mx-auto text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 mt-4">Đang tải logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">Không có logs nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={log._id || index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {log.userId.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {log.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.details?.status === 'success' || !log.details?.status ? (
                        <span className="text-green-600 font-semibold">✓ Success</span>
                      ) : (
                        <span className="text-red-600 font-semibold">✗ Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Trước
              </button>
              <span className="text-sm text-gray-700">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
