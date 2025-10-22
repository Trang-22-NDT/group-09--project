import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          const res = await api.get('/user/profile')
          setUser(res.data)
        } catch (err) {
          setUser(null)
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const login = async (email, password) => {
    // Mock login - kiểm tra localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }
    
    // Tạo mock tokens
    const accessToken = 'mock-access-token-' + Date.now()
    const refreshToken = 'mock-refresh-token-' + Date.now()
    
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    
    // Lưu user với role
    const userData = { 
      name: user.name, 
      email: user.email, 
      role: user.role || 'user' // Mặc định là 'user' nếu không có role
    }
    setUser(userData)
    
    return { data: { accessToken, refreshToken, user: userData } }
  }

  const signup = async (name, email, password, role = 'user') => {
    // Mock signup - lưu vào localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    // Kiểm tra email đã tồn tại
    if (users.find(u => u.email === email)) {
      throw { response: { data: { message: 'Email đã được đăng ký' } } }
    }
    
    // Thêm user mới với role
    users.push({ name, email, password, role })
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    
    return { data: { message: 'Đăng ký thành công' } }
  }
  
  // Hàm kiểm tra quyền
  const hasRole = (allowedRoles) => {
    if (!user) return false
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role)
    }
    return user.role === allowedRoles
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') })
    } catch (err) {}
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)