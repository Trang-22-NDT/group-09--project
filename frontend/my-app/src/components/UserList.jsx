import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);

  // ✅ Lấy danh sách user từ JSON Server
  useEffect(() => {
    axios.get("http://localhost:3001/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  // ✅ Thêm user mới
  const handleAdd = async () => {
    if (!newUser.name || !newUser.email) return;
    await axios.post("http://localhost:3001/users", newUser);
    setUsers([...users, res.data]);
    setNewUser({ name: "", email: "" });
  };

  // ✅ Xóa user
  const handleDelete = async (id) => {
   await axios.delete(`http://localhost:3001/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  // ✅ Sửa user (hiển thị form)
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // ✅ Lưu user sau khi sửa
  const handleSave = async () => {
    await axios.put(`http://localhost:3001/users/${editingUser.id}`, editingUser);
    setUsers(users.map((u) => (u.id === res.data.id ? res.data : u)));
    setEditingUser(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách User</h2>

      {users.length === 0 ? (
        <p>Không có dữ liệu!</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <>
                      <button onClick={handleSave}>Lưu</button>
                      <button onClick={() => setEditingUser(null)}>Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)}>Sửa</button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{ color: "red" }}
                      >
                        Xóa
                      </button>
                    </>
                  )}
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
      <button onClick={handleAdd}>+ Thêm</button>
    </div>
  );
}
