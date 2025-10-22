const User = require('../models/User');
const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');

// ===== HOẠT ĐỘNG 2: USER MANAGEMENT APIs =====

// @desc    Get all users (ADMIN only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    console.log(`👤 User ${req.user.email} (${req.user.role}) - Get all users`);

    const users = await User.find().select('-password -refreshTokens');

    res.status(200).json({
      success: true,
      message: `Tìm thấy ${users.length} người dùng`,
      data: {
        count: users.length,
        users
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Get user by ID (ADMIN/MODERATOR)
// @route   GET /api/users/:id
// @access  Private/Admin/Moderator
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`👤 User ${req.user.email} (${req.user.role}) - Get user ${id}`);

    const user = await User.findById(id).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Update user role (ADMIN only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'moderator', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role không hợp lệ. Cho phép: ${validRoles.join(', ')}`
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    console.log(`✅ Role updated: ${user.email} - ${oldRole} → ${role}`);

    res.status(200).json({
      success: true,
      message: `Cập nhật role thành công: ${oldRole} → ${role}`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          oldRole,
          newRole: user.role
        }
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Delete user (ADMIN only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`👤 User ${req.user.email} (${req.user.role}) - Delete user ${id}`);

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công',
      data: {
        deletedUser: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Get user profile (User xem profile của họ)
// @route   GET /api/users/profile/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// ===== HOẠT ĐỘNG 3: UPLOAD AVATAR =====

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    console.log('📸 Upload avatar request - User:', req.user.email);

    // Kiểm tra file có được upload không
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    console.log('📁 File info:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size + ' bytes',
      buffer: req.file.buffer ? 'Buffer exists' : 'No buffer'
    });

    // Step 1: Resize ảnh bằng Sharp (300x300)
    console.log('🔄 Resizing image with Sharp...');
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log('✅ Image resized:', resizedImageBuffer.length, 'bytes');

    // Step 2: Upload lên Cloudinary
    console.log('☁️ Uploading to Cloudinary...');

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'group-09-avatars',
          public_id: `avatar_${req.user.id}_${Date.now()}`,
          resource_type: 'image',
          overwrite: true
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success:', result.secure_url);
            resolve(result);
          }
        }
      );

      // Pipe resized buffer to Cloudinary
      uploadStream.end(resizedImageBuffer);
    });

    // Step 3: Lưu URL vào MongoDB
    console.log('💾 Saving avatar URL to database...');

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Xóa ảnh cũ trên Cloudinary (nếu có)
    if (user.avatar) {
      try {
        const oldPublicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(oldPublicId);
        console.log('🗑️ Old avatar deleted from Cloudinary');
      } catch (deleteError) {
        console.log('⚠️ Failed to delete old avatar:', deleteError.message);
      }
    }

    // Cập nhật avatar URL
    user.avatar = uploadResult.secure_url;
    await user.save();

    console.log('✅ Avatar uploaded successfully');

    res.status(200).json({
      success: true,
      message: '✅ Upload avatar thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        cloudinary: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes
        }
      }
    });
  } catch (error) {
    console.error('❌ Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload avatar',
      error: error.message
    });
  }
};

// @desc    Delete user avatar
// @route   DELETE /api/users/avatar
// @access  Private
exports.deleteAvatar = async (req, res) => {
  try {
    console.log('🗑️ Delete avatar request - User:', req.user.email);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    if (!user.avatar) {
      return res.status(400).json({
        success: false,
        message: 'Người dùng chưa có avatar'
      });
    }

    // Xóa ảnh trên Cloudinary
    try {
      const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      console.log('✅ Avatar deleted from Cloudinary');
    } catch (deleteError) {
      console.log('⚠️ Failed to delete from Cloudinary:', deleteError.message);
    }

    // Xóa avatar URL khỏi database
    user.avatar = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Xóa avatar thành công',
      data: { user }
    });
  } catch (error) {
    console.error('❌ Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa avatar',
      error: error.message
    });
  }
};