import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]); // state lưu danh sách users

  // Hàm fetch users từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data); // cập nhật state
    } catch (err) {
      console.error("Lỗi khi fetch users:", err);
    }
  };

  // useEffect chạy 1 lần khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Danh sách Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
