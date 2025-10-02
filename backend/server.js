const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware đọc JSON
app.use(express.json());

// Import routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// Route test gốc
app.get('/', (req, res) => {
  res.send('Backend server is running...');
});

// Lắng nghe cổng
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
