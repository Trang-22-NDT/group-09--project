const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Protect routes - require valid JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có token, từ chối truy cập'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // ===== HOẠT ĐỘNG 1: HANDLE TOKEN EXPIRATION =====
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token đã hết hạn',
        error: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt
      });
    }
    // ==================================================

    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
      error: error.message
    });
  }
};

// @desc    Authorize based on user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' không được phép truy cập`
      });
    }
    next();
  };
};