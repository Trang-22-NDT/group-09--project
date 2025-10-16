const express = require('express');
const router = express.Router();
const { 
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// User profile routes (Protected)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/password', protect, changePassword);

module.exports = router;