import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]); // lưu danh sách user
  const [formData, setFormData] = useState({ name: "", email: "" }); // lưu dữ liệu nhập từ form

  // ✅ Lấy danh sách user khi mở trang
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data); // cập nhật danh sách
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Thêm user mới
  const handleAdd = async () => {
    if (!formData.name || !formData.email) {
      alert("Vui lòng nhập đầy đủ Tên và Email!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/users", formData);
      setUsers([res.data, ...users]); // thêm user mới vào đầu danh sách
      setFormData({ name: "", email: "" }); // reset form
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔥 Kết nối React với MongoDB 🔥</h2>

      {/* Form nhập user */}
      <input
        type="text"
        placeholder="Tên"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button onClick={handleAdd}>Thêm User</button>

      {/* Hiển thị danh sách user */}
      <h3>Danh sách User</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
