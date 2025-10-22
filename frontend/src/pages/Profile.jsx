import React, { useEffect, useState } from 'react'
import AuthCard from '../components/AuthCard'
import api from '../api/axios'
import { useAuth } from '../context/AuthProvider'

/*
  Profile page:
  - Hiển thị name, email (readonly), phone
  - Cho phép đổi mật khẩu: password + confirmPassword (tùy chọn)
  - Gửi PUT /user/profile với { name, phone, password? } (chỉ gửi password khi người dùng nhập)
*/

export default function Profile() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState(authUser || null)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await api.get('/user/profile')
        setUser(res.data)
        setPhone(res.data.phone || '')
      } catch (error) {
        setErr('Không thể tải thông tin cá nhân.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (!user) fetchProfile()
    else setPhone(user.phone || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validate = () => {
    setErr(null)
    if (!user?.name || !user.name.trim()) {
      setErr('Vui lòng nhập họ tên.')
      return false
    }
    if (password) {
      if (password.length < 6) {
        setErr('Mật khẩu mới phải ít nhất 6 ký tự.')
        return false
      }
      if (password !== confirmPassword) {
        setErr('Mật khẩu nhập lại không khớp.')
        return false
      }
    }
    return true
  }

  const handleSave = async (e) => {
    e && e.preventDefault()
    setMsg(null)
    setErr(null)
    if (!validate()) return

    const payload = { name: user.name, phone: phone || '' }
    if (password) payload.password = password

    setLoading(true)
    try {
      await api.put('/user/profile', payload)
      setMsg('Lưu thành công.')
      // Optionally refresh profile
      try {
        const fresh = await api.get('/user/profile')
        setUser(fresh.data)
        setPhone(fresh.data.phone || '')
      } catch (_) {}
      // clear password fields
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Lỗi lưu profile', error)
      setErr(error?.response?.data?.message || 'Lưu thất bại.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) return <div className="center-wrap"><div className="card">Đang tải...</div></div>

  return (
    <AuthCard title="Thông tin cá nhân" footer={<div/>}>
      <form className="form" onSubmit={handleSave}>
        <label>Họ tên</label>
        <input
          value={user?.name || ''}
          onChange={e => setUser(u => ({ ...(u || {}), name: e.target.value }))}
          placeholder="Nhập họ tên..."
          required
        />

        <label>Email</label>
        <input value={user?.email || ''} readOnly />

        <label>Số điện thoại</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập số điện thoại..." />

        <hr style={{margin: '16px 0', border: 'none', borderTop: '1px solid #eee'}} />

        <div style={{fontWeight:600, marginBottom:8}}>Đổi mật khẩu (tùy chọn)</div>
        <label>Mật khẩu mới</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu mới..." />
        <label>Nhập lại mật khẩu mới</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới..." />

        {err && <div className="err" style={{marginTop:8}}>{err}</div>}
        {msg && <div className="msg" style={{marginTop:8}}>{msg}</div>}

        <button className="btn-save" type="submit" disabled={loading} style={{marginTop:12}}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>

        <button type="button" className="btn-cancel" onClick={()=>{
          // reset password fields & messages
          setPassword('')
          setConfirmPassword('')
          setErr(null)
          setMsg(null)
        }} style={{marginTop:10}}>
          Hủy
        </button>
      </form>
    </AuthCard>
  )
}