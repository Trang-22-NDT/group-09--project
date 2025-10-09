import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  // Giả lập API GET /users
  useEffect(() => {
    const fakeUsers = [
      { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", role: "User" },
      { id: 2, name: "Trần Thị B", email: "btran@example.com", role: "User" },
      { id: 3, name: "Admin", email: "admin@example.com", role: "Admin" },
    ];
    setUsers(fakeUsers);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
      setUsers(users.filter((u) => u.id !== id));
      alert(`Đã xóa user có ID: ${id}`);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-box">
        <h2>Quản lý người dùng (Admin)</h2>

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
