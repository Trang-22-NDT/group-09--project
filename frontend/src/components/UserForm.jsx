import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthCard from './AuthCard'
import api from '../api/axios'
import { useAuth } from '../context/AuthProvider'

/*
  UserForm props:
  - mode: 'signup' | 'profile'
    - 'signup': hiển thị form đăng ký (name, email, password, confirmPassword) và gọi signup()
    - 'profile': hiển thị form thông tin cá nhân (name, email readonly, phone) + phần đổi mật khẩu (password, confirmPassword)
  - onSuccess (optional): callback sau khi thành công
*/
export default function UserForm({ mode = 'signup', onSuccess }) {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [msg, setMsg] = useState(null)

  // common fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // If profile mode, fetch existing profile
  useEffect(() => {
    if (mode === 'profile') {
      const fetchProfile = async () => {
        setLoading(true)
        try {
          const res = await api.get('/user/profile')
          const u = res.data
          setName(u.name || '')
          setEmail(u.email || '')
          setPhone(u.phone || '')
        } catch (error) {
          setErr('Không thể tải thông tin người dùng.')
        } finally {
          setLoading(false)
        }
      }
      fetchProfile()
    } else {
      // clear profile fields in signup mode
      setName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setConfirmPassword('')
      setErr(null)
      setMsg(null)
    }
  }, [mode])

  const validateSignup = () => {
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
    setErr(null)
    return true
  }

  const validateProfile = () => {
    if (!name.trim()) {
      setErr('Vui lòng nhập họ tên.')
      return false
    }
    if (password) {
      if (password.length < 6) {
        setErr('Mật khẩu mới phải có ít nhất 6 ký tự.')
        return false
      }
      if (password !== confirmPassword) {
        setErr('Mật khẩu nhập lại không khớp.')
        return false
      }
    }
    setErr(null)
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg(null)
    setErr(null)

    if (mode === 'signup') {
      if (!validateSignup()) return
      setLoading(true)
      try {
        await signup(name, email, password)
        setMsg('Đăng ký thành công. Chuyển tới đăng nhập...')
        if (onSuccess) onSuccess()
        setTimeout(() => navigate('/login'), 1000)
      } catch (error) {
        setErr(error?.response?.data?.message || 'Đăng ký thất bại')
      } finally {
        setLoading(false)
      }
    } else {
      // profile update
      if (!validateProfile()) return
      const payload = { name, phone }
      if (password) payload.password = password
      setLoading(true)
      try {
        await api.put('/user/profile', payload)
        setMsg('Cập nhật thành công.')
        if (onSuccess) onSuccess()
        // refetch optional: already kept form up-to-date
      } catch (error) {
        setErr(error?.response?.data?.message || 'Cập nhật thất bại.')
      } finally {
        setLoading(false)
      }
    }
  }

  const isSignupDisabled = !name || !email || !password || !confirmPassword || password !== confirmPassword || password.length < 6
  const isProfileDisabled = !name || (password && (password !== confirmPassword || password.length < 6))

  return (
    <AuthCard title={mode === 'signup' ? 'Tạo tài khoản' : 'Thông tin cá nhân'}
              footer={mode === 'signup' ? <div style={{textAlign:'center'}}>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></div> : <div/>}>
      <form className="form" onSubmit={handleSubmit}>
        <label>Họ và tên</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nhập họ tên..." required />

        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email..." required readOnly={mode === 'profile'} />

        <label>Số điện thoại</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập số điện thoại..." />

        <hr style={{margin: '16px 0', border: 'none', borderTop: '1px solid #eee'}} />

        <div style={{fontWeight:600, marginBottom:8}}>{mode === 'signup' ? 'Mật khẩu' : 'Đổi mật khẩu (tùy chọn)'}</div>

        <label>Mật khẩu {mode === 'signup' ? '' : '(mới)'}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'Nhập mật khẩu...' : 'Nhập mật khẩu mới...'} />

        <label>Nhập lại mật khẩu</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu..." />

        {err && <div className="err" style={{marginTop:8}}>{err}</div>}
        {msg && <div className="msg" style={{marginTop:8}}>{msg}</div>}

        <button className={mode === 'signup' ? 'btn-primary' : 'btn-save'}
                type="submit"
                disabled={loading || (mode === 'signup' ? isSignupDisabled : isProfileDisabled)}
                style={{marginTop:12}}>
          {loading ? 'Đang xử lý...' : (mode === 'signup' ? 'Đăng ký' : 'Lưu thay đổi')}
        </button>

        {mode === 'profile' && (
          <button type="button" className="btn-cancel" onClick={() => {
            setPassword('')
            setConfirmPassword('')
            setErr(null)
            setMsg(null)
          }} style={{marginTop:10}}>
            Hủy
          </button>
        )}
      </form>
    </AuthCard>
  )
}