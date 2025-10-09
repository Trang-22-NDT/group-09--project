import React, { useState } from "react";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("Vui lòng nhập email!");
    // Giả lập gửi yêu cầu tới API /forgot-password
    setTimeout(() => {
      setMessage(`Token reset đã được gửi đến ${email}`);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
            />
          </div>
          <button type="submit" className="btn-primary">
            Gửi token reset
          </button>
        </form>
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}
