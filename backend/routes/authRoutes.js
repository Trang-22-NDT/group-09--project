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
const { forgotPasswordLimiter } = require('../middleware/rateLimit');
const loginLimiter = require('../middleware/loginRateLimit');

// Public routes
router.post('/signup', signup);
router.post('/login', loginLimiter, login);

// ===== HOẠT ĐỘNG 1: REFRESH TOKEN ROUTE =====
router.post('/refresh', refreshToken);  // ← THÊM
// ============================================

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
// Apply rate limiter to forgot-password to reduce abuse
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;