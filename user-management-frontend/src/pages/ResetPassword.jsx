import React, { useState } from "react";
import "./Auth.css";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token || !password) return alert("Vui lòng nhập đủ thông tin!");
    // Giả lập API /reset-password
    setTimeout(() => {
      setMessage("Đổi mật khẩu thành công!");
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Token Reset</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Nhập token nhận qua email"
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <button type="submit" className="btn-primary">
            Đổi mật khẩu
          </button>
        </form>
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}
