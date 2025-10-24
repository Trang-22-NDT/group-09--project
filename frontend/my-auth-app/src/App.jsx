import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, loadUserFromToken, selectAuth } from './redux/slices/authSlice'
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

export default function App() {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading } = useSelector(selectAuth)

  useEffect(() => {
    // Load user from token on app init
    dispatch(loadUserFromToken())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const hasRole = (roles) => {
    if (!user) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  // Show loading while checking authentication
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-200">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-blue-500 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-700 text-lg">Đang tải...</p>
        </div>
      </div>
    )
  }

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
        
        {isAuthenticated && user ? (
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
            <button className="btn-ghost" onClick={handleLogout}>Đăng xuất</button>
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
              Hệ thống quản lý với Redux Toolkit
            </h1>
            <p style={{fontSize:18, marginBottom:30}}>
              State management nâng cao + Protected Routes + Role-Based Access Control
            </p>
            {!isAuthenticated && (
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
      {isAuthenticated && <TokenStatus />}
    </div>
  )
}