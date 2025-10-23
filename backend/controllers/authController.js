const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ===== Helper function: Tạo JWT tokens =====
const generateTokens = async (user) => {
  try {
    // Access Token (15 phút)
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Refresh Token (7 ngày) + lưu vào database
    const refreshToken = user.generateRefreshToken();
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Lỗi khi tạo token');
  }
};
// ==========================================

// @desc    User signup
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không khớp'
      });
    }

    // Check email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    console.log('✅ Signup Success:', {
      userId: user._id,
      email: user.email,
      name: user.name
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    User login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    // Check user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    console.log('✅ Login Success:', {
      userId: user._id,
      email: user.email
    });

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
// ===== HOẠT ĐỘNG 1: REFRESH TOKEN API =====
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Validate
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token không được tìm thấy'
      });
    }

    // Verify token format
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh-secret-key'
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ hoặc đã hết hạn',
        error: error.message
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Verify refresh token trong database
    const tokenValid = user.verifyRefreshToken(refreshToken);
    if (!tokenValid) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token đã bị revoke hoặc không hợp lệ'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    console.log('✅ Refresh Token Success:', {
      userId: user._id,
      email: user.email,
      newAccessToken: newAccessToken.slice(0, 20) + '...'
    });

    res.status(200).json({
      success: true,
      message: 'Refresh token thành công',
      data: {
        accessToken: newAccessToken,
        refreshToken: refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
// =========================================

// @desc    User logout
// @route   POST /api/auth/logout
// @access  Private
// ===== HOẠT ĐỘNG 1: REVOKE REFRESH TOKEN =====
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Revoke specific refresh token
    if (refreshToken) {
      await user.revokeRefreshToken(refreshToken);
    }

    console.log('✅ Logout Success:', {
      userId: user._id,
      email: user.email
    });

    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
// ==========================================

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user với email này'
      });
    }

    // Generate secure reset token (plain) and save hashed version in DB
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Send email with plain token in URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `Click link sau de reset mat khau: ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Link',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Reset password link đã được gửi đến email'
      });
    } catch (emailError) {
      // Clear reset fields on failure to send email
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error('Error sending reset email:', emailError.message || emailError);
      return res.status(500).json({
        success: false,
        message: 'Loi khi gui email',
        error: emailError.message || emailError
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không khớp'
      });
    }

    // Hash incoming token and find user with matching hashed token and unexpired
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được thay đổi thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};