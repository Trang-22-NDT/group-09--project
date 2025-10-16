const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
      minlength: [2, 'Tên phải ít nhất 2 ký tự'],
      maxlength: [50, 'Tên không được vượt quá 50 ký tự']
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập email hợp lệ'
      ]
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải ít nhất 6 ký tự'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: null
    },
    
    // ===== HOẠT ĐỘNG 1: REFRESH TOKEN =====
    refreshTokens: [
      {
        token: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800 // 7 ngày - TTL index
        }
      }
    ],
    // =======================================
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// ===== PRE-SAVE MIDDLEWARE: Hash password =====
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ===== METHOD: Compare password =====
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ===== METHOD: Generate JWT Access Token =====
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
};

// ===== HOẠT ĐỘNG 1: METHODS REFRESH TOKEN =====

// Method: Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    { expiresIn: '7d' }
  );
  
  // Lưu refresh token vào database
  this.refreshTokens.push({ token: refreshToken });
  
  return refreshToken;
};

// Method: Verify Refresh Token
userSchema.methods.verifyRefreshToken = function (token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'refresh-secret-key'
    );
    
    // Kiểm tra token có trong database không
    const tokenExists = this.refreshTokens.some(rt => rt.token === token);
    
    return tokenExists ? decoded : null;
  } catch (error) {
    return null;
  }
};

// Method: Revoke Refresh Token (khi logout)
userSchema.methods.revokeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

// Method: Revoke All Tokens (logout from all devices)
userSchema.methods.revokeAllTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

// =============================================

module.exports = mongoose.model('User', userSchema);