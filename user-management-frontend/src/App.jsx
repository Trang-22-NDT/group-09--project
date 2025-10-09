import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UploadAvatar from "./pages/UploadAvatar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chính */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Đăng ký / Đăng nhập */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Thông tin cá nhân */}
        <Route path="/profile" element={<Profile />} />

        {/* Quản lý người dùng (Admin) */}
        <Route path="/admin" element={<AdminUsers />} />

        {/* Quên mật khẩu / Đặt lại mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Upload ảnh đại diện */}
        <Route path="/upload-avatar" element={<UploadAvatar />} />

        {/* Nếu đường dẫn không tồn tại */}
        <Route path="*" element={<h2 style={{ textAlign: "center" }}>404 - Trang không tồn tại</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
