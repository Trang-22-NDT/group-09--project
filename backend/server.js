const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();
app.use(bodyParser.json());

// Dùng routes
app.use('/', userRoutes);

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
