import React, { useState } from "react";
import axios from "axios";

function AddUser({ fetchUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    // Gửi request thêm user
    await axios.post("http://localhost:3000/users", { name, email });

    // Refresh danh sách
    fetchUsers();

    // Clear input
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm User</h2>
      <input
        type="text"
        placeholder="Nhập tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button type="submit">Thêm</button>
    </form>
  );
}

export default AddUser;
