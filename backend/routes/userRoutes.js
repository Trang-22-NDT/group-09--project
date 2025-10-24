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

// Admin routes for users
const { getAllUsers, getUserById } = require('../controllers/userController');
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);

module.exports = router;