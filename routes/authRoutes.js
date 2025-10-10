const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  logout, 
  getMe,
  forgotPassword,    // ← THÊM
  resetPassword      // ← THÊM
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Debug logs
console.log('🔍 authRoutes.js loaded!');
console.log('🔍 Controllers:', { 
  signup: typeof signup, 
  login: typeof login, 
  logout: typeof logout, 
  getMe: typeof getMe,
  forgotPassword: typeof forgotPassword,     // ← THÊM
  resetPassword: typeof resetPassword        // ← THÊM
});

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// ===== HOẠT ĐỘNG 4: FORGOT & RESET PASSWORD =====
router.post('/forgot-password', forgotPassword);        // ← THÊM
router.post('/reset-password/:token', resetPassword);   // ← THÊM
// ================================================

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

console.log('✅ authRoutes.js - All routes registered!');

module.exports = router;