import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../context/AuthProvider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr(null)
    if (!email || !password) {
      setErr('Vui lòng điền email và mật khẩu.')
      return
    }
    setLoading(true)
    try {
      // login() được cung cấp bởi AuthProvider: trả về { accessToken, refreshToken, user }
      await login(email.trim(), password)
      navigate('/profile')
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại'
      setErr(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Đăng nhập"
      footer={<div style={{ textAlign: 'center' }}>Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link></div>}
    >
      <form onSubmit={handleSubmit} className="form">
        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Nhập email..."
          type="email"
          required
        />

        <label>Mật khẩu</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu..."
          type="password"
          required
        />

        {err && <div className="err">{err}</div>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </AuthCard>
  )
}