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
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user: userData } = res.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(userData)
    return res
  }

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password })
    return res
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
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)