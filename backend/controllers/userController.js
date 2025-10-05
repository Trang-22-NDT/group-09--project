let users = [
  { id: 1, name: "Nguyen Đoan Trang", email: "trang@example.com" },
  { id: 2, name: "Mai Văn Vàng", email: "vang@example.com" },
  { id: 3, name: "Nguyễn Văn Khánh", email: "khanh@example.com" }
];

const getUsers = (req, res) => res.json(users);

const createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name & Email are required" });
  const newUser = { id: users.length ? users[users.length-1].id + 1 : 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u.id == id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id != id);
  res.json({ message: "User deleted" });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
