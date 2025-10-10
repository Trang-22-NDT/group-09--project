const express = require('express');
const router = express.Router();
const { 
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  uploadAvatar        // ← PHẢI CÓ!
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');  // ← PHẢI CÓ!

console.log('🔍 userRoutes.js loaded!');
console.log('🔍 uploadAvatar function:', typeof uploadAvatar);  // ← DEBUG
console.log('🔍 upload middleware:', typeof upload);  // ← DEBUG

// USER PROFILE ROUTES (Protected)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/password', protect, changePassword);

// ===== HOẠT ĐỘNG 4: UPLOAD AVATAR =====
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

// ADMIN ROUTES (Protected + Admin Only)
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

console.log('✅ userRoutes.js - All routes registered!');

module.exports = router;