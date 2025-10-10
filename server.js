const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env
dotenv.config();

// Kết nối Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Auth API - Group 09',
    status: 'Server is running',
    author: 'Trang-22-NDT',
    date: new Date().toISOString(),
    endpoints: {
      // Auth
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      getMe: 'GET /api/auth/me',
      // User Profile
      getProfile: 'GET /api/users/profile',
      updateProfile: 'PUT /api/users/profile',
      changePassword: 'PUT /api/users/profile/password'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Đăng ký Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`👤 Author: Trang-22-NDT`);
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
});