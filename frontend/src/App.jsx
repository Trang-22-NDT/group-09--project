import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import { useAuth } from './context/AuthProvider'

export default function App() {
  const { user, logout } = useAuth()

  return (
    <div className="app-bg">
      <nav className="top-nav">
        <Link to="/" style={{color:'#fff', fontWeight:700}}>Home</Link>
        <div style={{flex:1}}/>
        {user ? (
          <>
            <span style={{marginRight:12, color:'#fff'}}>Xin chào, {user.name}</span>
            <button className="btn-ghost" onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{color:'#fff'}}>Đăng nhập</Link>
            <Link to="/signup" style={{color:'#fff', marginLeft:12}}>Đăng ký</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<div style={{paddingTop:80,textAlign:'center'}}>Trang chủ — mở /login, /signup hoặc /profile</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}