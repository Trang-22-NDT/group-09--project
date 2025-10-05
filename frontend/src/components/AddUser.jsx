import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ fetchUsers }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users", { name, email });
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
      alert("Thêm user thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm User</button>
    </form>
  );
};

export default AddUser;
