import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editUser, setEditUser] = useState(null);

  // ✅ Lấy danh sách user khi load trang
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  // ✅ Thêm user mới
  const handleAdd = async () => {
    if (!newUser.name || !newUser.email) return;
    await axios.post("http://localhost:5000/users", newUser);
    setNewUser({ name: "", email: "" });
    fetchUsers();
  };

  // ✅ Xóa user
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  // ✅ Bắt đầu sửa user
  const handleEdit = (user) => {
    setEditUser(user);
  };

  // ✅ Cập nhật user
  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/users/${editUser.id}`, editUser);
    setEditUser(null);
    fetchUsers();
  };

  return (
    <div className="user-list">
      <h1>Demo CRUD với JSON Server</h1>

      <h2>Danh sách User</h2>
      {users.length === 0 ? (
        <p>Không có dữ liệu!</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(user.id)}>🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Thêm user mới</h3>
      <input
        placeholder="Tên"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button onClick={handleAdd}>➕ Thêm</button>

      {editUser && (
        <div className="edit-form">
          <h3>Sửa user</h3>
          <input
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <button onClick={handleUpdate}>💾 Lưu</button>
          <button onClick={() => setEditUser(null)}>❌ Hủy</button>
        </div>
      )}
    </div>
  );
}
