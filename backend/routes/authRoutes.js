const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  logout, 
  getMe,
  refreshToken,  // ← HOẠT ĐỘNG 1
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// ===== HOẠT ĐỘNG 1: REFRESH TOKEN ROUTE =====
router.post('/refresh', refreshToken);  // ← THÊM
// ============================================

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;