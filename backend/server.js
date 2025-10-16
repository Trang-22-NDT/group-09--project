<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
=======
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
>>>>>>> backend

const app = express();
app.use(bodyParser.json());

<<<<<<< HEAD
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require("./routes/user");
app.use("/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
=======
// Dùng routes
app.use('/', userRoutes);

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
>>>>>>> backend
