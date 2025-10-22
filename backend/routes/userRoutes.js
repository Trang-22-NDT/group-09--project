const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getProfile,
  uploadAvatar,    // ← THÊM
  deleteAvatar     // ← THÊM
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');  // ← THÊM

// ===== PRIVATE ROUTES =====
// User profile
router.get('/profile/me', protect, getProfile);

// ===== HOẠT ĐỘNG 3: AVATAR ROUTES =====
// Upload avatar (Private - User upload avatar của họ)
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

// Delete avatar (Private)
router.delete('/avatar', protect, deleteAvatar);
// ==========================================

// ===== ADMIN ROUTES =====
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin', 'moderator'), getUserById);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;