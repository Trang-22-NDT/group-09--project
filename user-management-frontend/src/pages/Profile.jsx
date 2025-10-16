import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editMode, setEditMode] = useState(false);

  // Giả lập tải dữ liệu từ API (GET /profile)
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    alert("Cập nhật thành công!\n" + JSON.stringify(form, null, 2));
    setEditMode(false);
    // Khi có API thật: gọi PUT /profile ở đây
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Thông tin cá nhân</h2>

        {!editMode ? (
          <div className="profile-view">
            <p><b>Họ tên:</b> {form.name}</p>
            <p><b>Email:</b> {form.email}</p>
            <p><b>Số điện thoại:</b> {form.phone || "Chưa cập nhật"}</p>
            <button className="btn-primary" onClick={() => setEditMode(true)}>
              Chỉnh sửa
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Họ tên</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại..."
              />
            </div>

            <button type="submit" className="btn-primary">Lưu thay đổi</button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setEditMode(false)}
            >
              Hủy
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
