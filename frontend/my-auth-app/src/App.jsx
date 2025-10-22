import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import ModeratorDashboard from './pages/ModeratorDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import TokenStatus from './components/TokenStatus'
import UserAvatar from './components/UserAvatar'
import { useAuth } from './context/AuthProvider'

export default function App() {
  const { user, logout, hasRole } = useAuth()

  return (
    <div className="app-bg">
      <nav className="top-nav">
        <Link to="/" style={{color:'#fff', fontWeight:700}}>Home</Link>
        
        {/* Hiển thị menu theo role */}
        {user && (
          <>
            {hasRole('admin') && (
              <Link to="/admin" style={{color:'#fff', marginLeft:12}}>
                🔐 Admin
              </Link>
            )}
            {hasRole(['admin', 'moderator']) && (
              <Link to="/moderator" style={{color:'#fff', marginLeft:12}}>
                ⚡ Moderator
              </Link>
            )}
            <Link to="/profile" style={{color:'#fff', marginLeft:12}}>Profile</Link>
          </>
        )}
        
        <div style={{flex:1}}/>
        
        {user ? (
          <>
            <div style={{display:'flex', alignItems:'center', gap:12, marginRight:12}}>
              <UserAvatar user={user} size="sm" />
              <span style={{color:'#fff'}}>
                {user.name} 
                <span className="px-2 py-1 ml-2 bg-white/20 rounded text-sm">
                  {user.role}
                </span>
              </span>
            </div>
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
        <Route path="/" element={
          <div style={{paddingTop:80,textAlign:'center', color:'#333'}}>
            <h1 style={{fontSize:36, fontWeight:700, marginBottom:20}}>
              Hệ thống phân quyền RBAC
            </h1>
            <p style={{fontSize:18, marginBottom:30}}>
              Role-Based Access Control với 3 vai trò: User, Moderator, Admin
            </p>
            {!user && (
              <div>
                <Link to="/login" style={{
                  display:'inline-block',
                  padding:'12px 24px',
                  background:'linear-gradient(90deg, #7fead4, #8fe0d4)',
                  color:'#fff',
                  borderRadius:8,
                  fontWeight:600,
                  marginRight:12
                }}>
                  Đăng nhập
                </Link>
                <Link to="/signup" style={{
                  display:'inline-block',
                  padding:'12px 24px',
                  background:'linear-gradient(90deg, #5ea8ff, #4a90e2)',
                  color:'#fff',
                  borderRadius:8,
                  fontWeight:600
                }}>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/moderator" element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']}>
            <ModeratorDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Hiển thị Token Status khi đã đăng nhập */}
      {user && <TokenStatus />}
    </div>
  )
}