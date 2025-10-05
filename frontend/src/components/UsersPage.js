import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ Lấy danh sách user khi load trang
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Thêm user
  const handleAdd = async () => {
    if (!formData.name || !formData.email) {
      alert("Vui lòng nhập đầy đủ Tên và Email!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/users", formData);
      setUsers([res.data, ...users]);
      setFormData({ name: "", email: "" });
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  // ✅ Xóa user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔥 Quản lý User với React + Express 🔥</h2>

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
      <button onClick={handleAdd}>➕ Thêm User</button>

      <UserList users={users} onDelete={handleDelete} />
    </div>
  );
};

export default UsersPage;
