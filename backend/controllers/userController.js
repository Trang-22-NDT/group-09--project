let users = [
  { id: 1, name: "Nguyen Doan Trang" },
  { id: 2, name: "Mai Van Vang" },
  { id: 3, name: "Nguyen Van Khanh" }
];

// GET /users → trả về bảng HTML có nút sửa/xóa
const getUsers = (req, res) => {
  let html = `
    <html>
      <head>
        <title>User List</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 60%; margin: 20px auto; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background: #f2f2f2; }
          button { padding: 5px 10px; margin: 2px; cursor: pointer; }
          .edit { background: #4CAF50; color: white; border: none; }
          .delete { background: #f44336; color: white; border: none; }
          .add-btn { background: #2196F3; color: white; border: none; }
          form { text-align: center; margin: 20px; }
          input[type=text] { padding: 5px; width: 200px; }
        </style>
        <script>
          async function deleteUser(id) {
            await fetch('/users/' + id, { method: 'DELETE' });
            window.location.reload();
          }

          async function editUser(id) {
            const name = prompt("Nhập tên mới:");
            if (name) {
              await fetch('/users/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
              });
              window.location.reload();
            }
          }

          async function addUser(event) {
            event.preventDefault();
            const name = document.getElementById('newName').value;
            if (name) {
              await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
              });
              window.location.reload();
            }
          }
        </script>
      </head>
      <body>
        <h2 style="text-align:center">Danh sách Users</h2>
        
        <!-- Form thêm user -->
        <form onsubmit="addUser(event)">
          <input type="text" id="newName" placeholder="Nhập tên user mới..." required>
          <button type="submit" class="add-btn">➕ Thêm User</button>
        </form>

        <table>
          <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
          ${users.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>
                <button class="edit" onclick="editUser(${u.id})">Sửa</button>
                <button class="delete" onclick="deleteUser(${u.id})">Xóa</button>
              </td>
            </tr>
          `).join("")}
        </table>
      </body>
    </html>
  `;
  res.send(html);
};


// POST /users → thêm user mới
const createUser = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.status(201).json(newUser);
};

// PUT /users/:id → sửa user
const updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// DELETE /users/:id → xóa user
const deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id != id);
  res.json({ message: "User deleted" });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
