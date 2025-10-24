import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectAuth, clearError } from '../redux/slices/authSlice'

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState("");
  
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(selectAuth)

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccess("");
    
    if (password !== confirm) {
      setValidationError("Mật khẩu không khớp");
      return;
    }
    
    if (password.length < 6) {
      setValidationError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
      await dispatch(registerUser({ name, email, password })).unwrap()
      setSuccess("Đăng ký thành công! Đang chuyển đến trang profile...");
      // Will redirect via useEffect
    } catch (err) {
      // Error handled by Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-100 to-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Tạo tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {(validationError || error) && (
              <p className="text-sm text-red-600 mt-1">{validationError || error}</p>
            )}
          </div>

          {success && (
            <p className="text-sm text-green-600 text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-300 hover:bg-teal-400 text-white font-semibold py-2 rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-purple-700 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
