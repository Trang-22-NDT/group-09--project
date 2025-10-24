import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, selectAuth, clearError } from '../redux/slices/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rateLimitInfo, setRateLimitInfo] = useState(null)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(selectAuth)

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/profile')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setRateLimitInfo(null)
    
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap()
      // Success - will redirect via useEffect
    } catch (err) {
      // Check for rate limit error (429)
      if (err?.status === 429 || err?.includes?.('rate limit')) {
        setRateLimitInfo({
          message: err.message || 'Quá nhiều lần đăng nhập thất bại',
          retryAfter: 60
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-100 to-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="vang@gmail.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {error && (
            <div className={`p-4 rounded-lg text-sm ${
              rateLimitInfo 
                ? 'bg-red-50 border-2 border-red-500' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 font-semibold">{error}</p>
                  {rateLimitInfo && (
                    <div className="mt-2 space-y-1">
                      <p className="text-red-600 text-xs">
                        🔒 <strong>Tài khoản tạm thời bị khóa</strong>
                      </p>
                      <p className="text-red-600 text-xs">
                        ⏰ Vui lòng đợi <strong>{rateLimitInfo.retryAfter} giây</strong> trước khi thử lại
                      </p>
                      <p className="text-red-600 text-xs">
                        💡 Đây là biện pháp bảo mật chống brute force attack
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-300 hover:bg-teal-400 text-white font-semibold py-2 rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-purple-700 hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}