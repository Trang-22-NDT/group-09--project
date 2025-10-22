import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import { useAuth } from '../context/AuthProvider'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err, setErr] = useState(null)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    setErr(null)
    if (!name.trim() || !email.trim() || !password) {
      setErr('Vui lòng nhập đầy đủ thông tin.')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErr('Email không hợp lệ.')
      return false
    }
    if (password.length < 6) {
      setErr('Mật khẩu phải có ít nhất 6 ký tự.')
      return false
    }
    if (password !== confirmPassword) {
      setErr('Mật khẩu nhập lại không khớp.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)
    if (!validate()) return
    setLoading(true)
    try {
      await signup(name.trim(), email.trim(), password)
      setMsg('Đăng ký thành công. Chuyển tới đăng nhập...')
      setTimeout(() => navigate('/login'), 900)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Đăng ký thất bại'
      setErr(message)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = !name || !email || !password || !confirmPassword || password !== confirmPassword || password.length < 6

  return (
    <AuthCard
      title="Tạo tài khoản"
      footer={<div style={{ textAlign: 'center' }}>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></div>}
    >
      <form onSubmit={handleSubmit} className="form">
        <label>Họ và tên</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nhập họ tên..."
          required
        />

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

        <label>Nhập lại mật khẩu</label>
        <input
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu..."
          type="password"
          required
        />

        {err && <div className="err">{err}</div>}
        {msg && <div className="msg">{msg}</div>}

        <button className="btn-primary" type="submit" disabled={loading || isDisabled}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </AuthCard>
  )
}