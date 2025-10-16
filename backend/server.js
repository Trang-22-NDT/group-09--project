const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ===== ROUTES =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Group 09 Backend API - Refresh Token & Session Management',
    version: '1.0.0',
    author: 'Trang-22-NDT',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users'
    },
    timestamp: new Date().toISOString()
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found: ' + req.method + ' ' + req.path
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('🚀 Server running on port ' + PORT);
  console.log('📍 Environment: ' + process.env.NODE_ENV);
  console.log('🌐 API: http://localhost:' + PORT);
  console.log('👤 Author: Trang-22-NDT');
  console.log('📅 Date: ' + new Date().toISOString());
  console.log('==================================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;