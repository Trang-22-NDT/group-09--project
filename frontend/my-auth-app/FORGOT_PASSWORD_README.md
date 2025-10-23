# 🔐 Forgot Password & Reset Password Feature

## Mục tiêu
Cho phép người dùng khôi phục mật khẩu khi quên bằng cách gửi email chứa link reset password. Email thật được gửi qua Gmail SMTP với Nodemailer.

## Các tính năng đã triển khai (Frontend)

### 1. 📧 ForgotPassword Page (`src/pages/ForgotPassword.jsx`)
Trang yêu cầu reset password với các tính năng:
- **Email Input**: Form nhập email đơn giản, validate format
- **API Integration**: Gọi `POST /auth/forgot-password` với email
- **Success Message**: Thông báo email đã gửi
- **Error Handling**: Hiển thị lỗi nếu email không tồn tại
- **Instructions**: Hướng dẫn kiểm tra spam, link có hiệu lực 1 giờ
- **Navigation**: Link quay về login/signup

Route: `/forgot-password`

### 2. 🔒 ResetPassword Page (`src/pages/ResetPassword.jsx`)
Trang đặt lại mật khẩu mới với token:
- **Token from URL**: Lấy token từ URL params `/reset-password/:token`
- **Password Fields**: 2 trường nhập mật khẩu mới + xác nhận
- **Show/Hide Password**: Toggle hiển thị password
- **Validation**: 
  - Kiểm tra mật khẩu tối thiểu 6 ký tự
  - Kiểm tra 2 mật khẩu khớp nhau
- **API Integration**: Gọi `POST /auth/reset-password/:token`
- **Success Screen**: Hiển thị success + auto redirect về login sau 3s
- **Error Handling**: Token không hợp lệ hoặc hết hạn

Route: `/reset-password/:token`

### 3. 🔗 Login Page Update
Thêm link "Quên mật khẩu?" dưới trường password:
```jsx
<Link to="/forgot-password">Quên mật khẩu?</Link>
```

## Workflow Hoàn chỉnh

### 1. User Quên Mật Khẩu
```
1. User vào trang Login
2. Click "Quên mật khẩu?"
3. Nhập email → Submit
4. Nhận thông báo "Email đã gửi"
```

### 2. Backend Xử Lý (API - SV1 & SV3)
```
1. API nhận email
2. Kiểm tra email có tồn tại không
3. Sinh reset token (JWT hoặc random string)
4. Lưu token vào DB với thời hạn (1 giờ)
5. Tạo link reset: frontend-url/reset-password/{token}
6. Gửi email qua Nodemailer + Gmail SMTP
```

### 3. User Reset Password
```
1. User mở email, click vào link
2. Trình duyệt mở: /reset-password/{token}
3. User nhập password mới + confirm
4. Submit → API verify token + update password
5. Success → Auto redirect về Login
6. User đăng nhập với password mới
```

## Cấu trúc File

```
src/
├── pages/
│   ├── ForgotPassword.jsx    # Trang yêu cầu reset password
│   ├── ResetPassword.jsx     # Trang nhập password mới
│   └── Login.jsx             # Thêm link "Quên mật khẩu"
├── App.jsx                   # Routes mới
└── api/
    └── axios.js              # API calls
```

## API Endpoints (Backend cần implement)

### 1. Request Reset Password
```javascript
POST /auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Success Response (200):
{
  "success": true,
  "message": "Email reset password đã được gửi"
}

Error Response (404):
{
  "success": false,
  "message": "Email không tồn tại trong hệ thống"
}
```

### 2. Reset Password
```javascript
POST /auth/reset-password/:token
Content-Type: application/json

Request Body:
{
  "password": "newpassword123"
}

Success Response (200):
{
  "success": true,
  "message": "Mật khẩu đã được cập nhật thành công"
}

Error Response (400):
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

## Backend Implementation (Node.js/Express)

### 1. Setup Nodemailer (SV3)

```javascript
// config/email.js
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD    // App Password (not regular password)
  }
})

module.exports = transporter
```

**.env file:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Lấy App Password từ Gmail:**
1. Vào Google Account Settings
2. Security → 2-Step Verification (bật nếu chưa có)
3. App passwords → Generate new app password
4. Copy password vào .env

### 2. Forgot Password API (SV1)

```javascript
// routes/auth.js
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const User = require('../models/User')
const transporter = require('../config/email')

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    
    // Tìm user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email không tồn tại trong hệ thống' 
      })
    }
    
    // Sinh reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Lưu token vào DB (hash để bảo mật)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 giờ
    await user.save()
    
    // Tạo reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    
    // Nội dung email
    const message = `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Xin chào ${user.name},</p>
      <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.</p>
      <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:5px;margin:20px 0;">
        Đặt lại mật khẩu
      </a>
      <p>Hoặc copy link sau vào trình duyệt:</p>
      <p>${resetUrl}</p>
      <p><strong>Link này chỉ có hiệu lực trong 1 giờ.</strong></p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <hr>
      <p style="color:#666;font-size:12px;">Email tự động từ hệ thống. Vui lòng không reply.</p>
    `
    
    // Gửi email
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Đặt lại mật khẩu',
      html: message
    })
    
    res.json({
      success: true,
      message: 'Email reset password đã được gửi'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra khi gửi email' 
    })
  }
})

module.exports = router
```

### 3. Reset Password API (SV1)

```javascript
// routes/auth.js
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body
    
    // Hash token từ URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
    
    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      })
    }
    
    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      })
    }
    
    // Cập nhật password (hash bằng bcrypt trong User model)
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    
    res.json({
      success: true,
      message: 'Mật khẩu đã được cập nhật thành công'
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Có lỗi xảy ra khi đặt lại mật khẩu' 
    })
  }
})
```

### 4. User Model Update

```javascript
// models/User.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  
  // Thêm fields cho reset password
  resetPasswordToken: String,
  resetPasswordExpire: Date
})

// Hash password trước khi save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)
```

## Testing Checklist

### Frontend Testing
- [ ] Truy cập `/forgot-password` - form hiển thị đúng
- [ ] Nhập email không hợp lệ - hiển thị lỗi validation
- [ ] Nhập email hợp lệ → Submit - loading state hiển thị
- [ ] Success - thông báo "Email đã gửi"
- [ ] Click link "Quay lại đăng nhập" - redirect về `/login`

### Backend Testing (sau khi SV1 & SV3 implement)
- [ ] POST `/auth/forgot-password` với email không tồn tại - 404 error
- [ ] POST `/auth/forgot-password` với email hợp lệ - email được gửi
- [ ] Kiểm tra hộp thư - nhận email với link reset
- [ ] Click link trong email - mở trang `/reset-password/:token`
- [ ] Nhập password < 6 ký tự - hiển thị lỗi
- [ ] Nhập 2 password không khớp - hiển thị lỗi
- [ ] Nhập password hợp lệ → Submit - success screen
- [ ] Auto redirect về `/login` sau 3 giây
- [ ] Đăng nhập với password mới - thành công
- [ ] Thử dùng lại link cũ - token không hợp lệ

### Email Testing
- [ ] Email gửi từ Gmail SMTP thành công
- [ ] Subject line đúng: "🔐 Đặt lại mật khẩu"
- [ ] HTML email hiển thị đẹp
- [ ] Link trong email hoạt động
- [ ] Kiểm tra spam folder nếu không thấy email

## Security Best Practices

### 1. Token Generation
- ✅ Dùng `crypto.randomBytes(32)` - đủ random
- ✅ Hash token trước khi lưu DB
- ✅ Set expiration time (1 giờ)
- ✅ Xóa token sau khi dùng

### 2. Email Security
- ✅ Dùng Gmail App Password (không phải password thật)
- ✅ Không log sensitive data
- ✅ HTTPS cho production

### 3. Rate Limiting (Backend nên thêm)
```javascript
const rateLimit = require('express-rate-limit')

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 3, // Tối đa 3 requests
  message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút'
})

router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  // ...
})
```

## UI/UX Features

### ForgotPassword Page
- ✅ Icon khóa đẹp mắt
- ✅ Form đơn giản, dễ sử dụng
- ✅ Success/Error messages rõ ràng
- ✅ Instructions box hướng dẫn
- ✅ Navigation links

### ResetPassword Page
- ✅ Show/Hide password toggle
- ✅ Password requirements hiển thị
- ✅ Success screen với animation
- ✅ Auto redirect countdown
- ✅ Error handling cho token hết hạn

## Environment Variables Cần Thiết

### Backend (.env)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Production
```
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

## Troubleshooting

### 1. Email không gửi được
- Kiểm tra Gmail App Password đúng chưa
- Kiểm tra 2-Step Verification đã bật
- Kiểm tra less secure app access (không cần nếu dùng App Password)
- Kiểm tra firewall/network blocking port 587

### 2. Token không hợp lệ
- Kiểm tra token có bị truncate trong email không
- Kiểm tra thời gian expiration
- Kiểm tra hash algorithm giống nhau (sha256)

### 3. Email vào spam
- Thêm SPF/DKIM records (production)
- Improve email content (tránh spam keywords)
- Warm up email account (gửi từ từ lúc đầu)

## Future Enhancements

1. **SMS Reset**: Gửi OTP qua SMS thay vì email
2. **2FA Integration**: Require 2FA code để reset
3. **Account Recovery**: Câu hỏi bảo mật thay thế
4. **Email Templates**: Dùng template engine cho email đẹp hơn
5. **Audit Log**: Log tất cả reset password attempts

---

**Tác giả**: SV2 - Frontend Developer  
**Ngày tạo**: 2024  
**Phiên bản**: 1.0  
**Branch**: `feature/forgot-password`  
**Phối hợp**: SV1 (API), SV3 (Nodemailer)
