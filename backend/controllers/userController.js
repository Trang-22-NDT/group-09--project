// controllers/userController.js

// Mảng users tạm (chưa dùng DB)
let users = [
  { id: 1, name: "Nguyen Đoan Trang" },
  { id: 2, name: "Mai Văn Vàng" },
  { id: 3, name: "Nguyễn Văn Khánh" }
];

// GET /users
const getUsers = (req, res) => {
  res.json(users);
};

// POST /users
const createUser = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newUser = {
    id: users.length + 1,
    name
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };
