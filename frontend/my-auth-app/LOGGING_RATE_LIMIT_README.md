# 📊 Activity Logging & Rate Limiting Feature

## Mục tiêu
Ghi lại hoạt động người dùng trong hệ thống và chống brute force login attack bằng rate limiting.

## Các tính năng đã triển khai (Frontend - SV2)

### 1. 📋 ActivityLog Component (`src/components/ActivityLog.jsx`)
Component hiển thị danh sách activity logs với các tính năng:

#### Features:
- **Log Display Table**: Bảng hiển thị logs với đầy đủ thông tin
  - Timestamp (thời gian tương đối: "5 phút trước", "2 giờ trước")
  - User email với avatar
  - Action type với badge màu sắc
  - IP Address
  - Status (Success/Failed)

- **Filter by Action**: Lọc logs theo loại hành động
  - All (Tất cả)
  - Login (Đăng nhập thành công)
  - Failed Login (Đăng nhập thất bại)
  - Logout (Đăng xuất)

- **Pagination**: Phân trang khi có nhiều logs

- **Refresh Button**: Tải lại logs mới nhất

- **Mock Data**: Tự động generate mock data nếu API chưa có

#### Action Types & Badges:
```javascript
- 🔓 Login (green badge)
- ❌ Failed Login (red badge) 
- 🔒 Logout (gray badge)
- 📝 Register (blue badge)
- ✏️ Update Profile (purple badge)
- ⚡ Change Role (orange badge)
```

### 2. 🔐 Admin Dashboard Update
Thêm tab "Activity Logs" vào Admin Dashboard:
- **Tab Navigation**: Switch giữa "Quản lý Users" và "Activity Logs"
- **Integrated View**: ActivityLog component được nhúng vào dashboard
- **Admin Only**: Chỉ admin mới xem được logs

Route: `/admin` → Tab "📊 Activity Logs"

### 3. 🚫 Rate Limit UI (Login Page)
Hiển thị thông báo rate limit khi login thất bại quá nhiều lần:

#### Normal Error:
```
❌ Email hoặc mật khẩu không đúng
```

#### Rate Limited Error:
```
┌─────────────────────────────────────────┐
│ ❌ Quá nhiều lần đăng nhập thất bại     │
│                                         │
│ 🔒 Tài khoản tạm thời bị khóa           │
│ ⏰ Vui lòng đợi 60 giây trước khi thử   │
│ 💡 Đây là biện pháp bảo mật chống       │
│    brute force attack                   │
└─────────────────────────────────────────┘
```

Features:
- Detect HTTP 429 (Too Many Requests)
- Display retry-after time
- Security warning message
- Red border highlight

## API Integration

### 1. Get Logs Endpoint
```javascript
GET /logs
Query Parameters:
  - action: string (optional) - Filter by action type
  - page: number (default: 1)
  - limit: number (default: 20)

Response:
{
  "logs": [
    {
      "_id": "log123",
      "userId": "user@example.com",
      "action": "login",
      "timestamp": "2024-10-24T10:30:00.000Z",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "details": {
        "status": "success"
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### 2. Login with Rate Limit
```javascript
POST /auth/login
Body: { email, password }

Success Response (200):
{
  "token": "jwt-token",
  "user": { ... }
}

Rate Limited Response (429):
{
  "message": "Quá nhiều lần đăng nhập thất bại",
  "blockedUntil": "2024-10-24T10:35:00.000Z"
}
Headers:
  Retry-After: 60 (seconds)
```

## Backend Implementation Guide (SV1 & SV3)

### 1. Logging Middleware (SV1)

```javascript
// middleware/logActivity.js
const Log = require('../models/Log')

const logActivity = async (req, res, next) => {
  // Capture response
  const originalSend = res.send
  
  res.send = function(data) {
    // Log after response
    setTimeout(async () => {
      try {
        await Log.create({
          userId: req.user?.email || req.body?.email || 'anonymous',
          action: req.logAction || getActionFromRoute(req),
          timestamp: new Date(),
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          details: {
            status: res.statusCode < 400 ? 'success' : 'failed'
          }
        })
      } catch (error) {
        console.error('Log error:', error)
      }
    }, 0)
    
    originalSend.call(this, data)
  }
  
  next()
}

function getActionFromRoute(req) {
  if (req.path.includes('/login')) return 'login'
  if (req.path.includes('/logout')) return 'logout'
  if (req.path.includes('/register')) return 'register'
  return 'other'
}

module.exports = logActivity
```

**Usage:**
```javascript
// Apply globally
app.use(logActivity)

// Or specific routes
router.post('/login', logActivity, loginController)

// Or with custom action
router.post('/change-role', (req, res, next) => {
  req.logAction = 'change_role'
  next()
}, logActivity, changeRoleController)
```

### 2. Rate Limiting (SV1)

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const redis = require('redis')

// Create Redis client (optional, for distributed systems)
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
})

// Login rate limiter - 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
      blockedUntil: new Date(Date.now() + 15 * 60 * 1000)
    })
  }
})

// Stricter limiter for failed logins - 3 attempts per email
const failedLoginLimiter = {}

const trackFailedLogin = (email) => {
  if (!failedLoginLimiter[email]) {
    failedLoginLimiter[email] = {
      count: 0,
      firstAttempt: Date.now()
    }
  }
  
  const record = failedLoginLimiter[email]
  
  // Reset after 15 minutes
  if (Date.now() - record.firstAttempt > 15 * 60 * 1000) {
    record.count = 0
    record.firstAttempt = Date.now()
  }
  
  record.count++
  
  // Block after 3 failed attempts
  if (record.count >= 3) {
    const blockedUntil = new Date(record.firstAttempt + 15 * 60 * 1000)
    return {
      blocked: true,
      retryAfter: Math.ceil((blockedUntil - Date.now()) / 1000),
      blockedUntil
    }
  }
  
  return { blocked: false }
}

const checkFailedLoginLimit = (req, res, next) => {
  const { email } = req.body
  const status = trackFailedLogin(email)
  
  if (status.blocked) {
    return res.status(429).json({
      success: false,
      message: `Tài khoản tạm thời bị khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${status.retryAfter}s`,
      blockedUntil: status.blockedUntil
    })
  }
  
  next()
}

module.exports = { loginLimiter, checkFailedLoginLimit }
```

**Usage:**
```javascript
const { loginLimiter, checkFailedLoginLimit } = require('./middleware/rateLimiter')

router.post('/login', 
  loginLimiter,           // IP-based rate limit
  checkFailedLoginLimit,  // Email-based rate limit
  loginController
)
```

### 3. Log Model (SV3)

```javascript
// models/Log.js
const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'failed_login', 'register', 'update_profile', 'change_role', 'delete_user', 'other'],
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: String,
  userAgent: String,
  method: String,
  path: String,
  statusCode: Number,
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better query performance
logSchema.index({ userId: 1, timestamp: -1 })
logSchema.index({ action: 1, timestamp: -1 })
logSchema.index({ timestamp: -1 })

// TTL index - automatically delete logs older than 90 days
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

module.exports = mongoose.model('Log', logSchema)
```

### 4. Logs API Controller (SV1)

```javascript
// controllers/logController.js
const Log = require('../models/Log')

exports.getLogs = async (req, res) => {
  try {
    const { action, page = 1, limit = 20, userId } = req.query
    
    // Build query
    const query = {}
    if (action) query.action = action
    if (userId) query.userId = userId
    
    // Pagination
    const skip = (page - 1) * limit
    
    // Get logs
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
    
    // Get total count
    const totalCount = await Log.countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)
    
    res.json({
      success: true,
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasMore: page < totalPages
      }
    })
    
  } catch (error) {
    console.error('Get logs error:', error)
    res.status(500).json({
      success: false,
      message: 'Có lỗi khi lấy logs'
    })
  }
}

// Get logs for specific user
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const skip = (page - 1) * limit
    
    const logs = await Log.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
    
    res.json({ success: true, logs })
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get login statistics
exports.getLoginStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const match = {
      action: { $in: ['login', 'failed_login'] }
    }
    
    if (startDate || endDate) {
      match.timestamp = {}
      if (startDate) match.timestamp.$gte = new Date(startDate)
      if (endDate) match.timestamp.$lte = new Date(endDate)
    }
    
    const stats = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ])
    
    res.json({ success: true, stats })
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
```

**Routes:**
```javascript
// routes/logs.js
const express = require('express')
const router = express.Router()
const { getLogs, getUserLogs, getLoginStats } = require('../controllers/logController')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.get('/', authenticate, requireAdmin, getLogs)
router.get('/user/:userId', authenticate, requireAdmin, getUserLogs)
router.get('/stats/login', authenticate, requireAdmin, getLoginStats)

module.exports = router
```

## Testing Guide

### Frontend Testing (SV2)

#### 1. Activity Logs Display
- [ ] Login as Admin
- [ ] Navigate to Admin Dashboard
- [ ] Click tab "📊 Activity Logs"
- [ ] Logs display in table format
- [ ] Chụp ảnh: Giao diện bảng logs

#### 2. Filter Logs
- [ ] Click "🔓 Login" filter - chỉ hiển thị login logs
- [ ] Click "❌ Failed Login" filter - chỉ hiển thị failed login logs
- [ ] Click "Tất cả" - hiển thị tất cả logs
- [ ] Chụp ảnh: Filter hoạt động

#### 3. Refresh Logs
- [ ] Click nút "Refresh"
- [ ] Logs được tải lại
- [ ] Chụp ảnh: Refresh button

#### 4. Rate Limit UI
- [ ] Vào trang Login
- [ ] Nhập sai password 3 lần liên tục
- [ ] Lần thứ 4 sẽ hiển thị thông báo rate limit
- [ ] Chụp ảnh: Rate limit warning với thông tin retry-after
- [ ] Đợi hết thời gian → thử login lại được

### Backend Testing (SV1 & SV3)

#### Postman Tests:

**1. Test Logging:**
```
1. POST /auth/login (success)
   → Check MongoDB logs collection có record mới
   → action: "login", status: "success"

2. POST /auth/login (failed)
   → Check MongoDB logs collection
   → action: "failed_login", status: "failed"

3. GET /logs
   → Returns array of logs
```

**2. Test Rate Limiting:**
```
1. POST /auth/login with wrong password (1st attempt)
   → Status: 401, message: "Password incorrect"

2. POST /auth/login with wrong password (2nd attempt)
   → Status: 401

3. POST /auth/login with wrong password (3rd attempt)
   → Status: 401

4. POST /auth/login with wrong password (4th attempt)
   → Status: 429 (Too Many Requests)
   → Response: { message: "Quá nhiều lần...", blockedUntil: "..." }
   → Header: Retry-After: 900

5. Wait 15 minutes OR reset rate limiter
   → POST /auth/login again → Works
```

**Chụp ảnh Postman:**
- Request đăng nhập thành công
- MongoDB collection logs có record mới
- Request bị rate limit (429)
- Response body với thông báo rate limit

## Security Features

### 1. Brute Force Protection
- **IP-based limiting**: Max 5 failed attempts per IP per 15 minutes
- **Email-based limiting**: Max 3 failed attempts per email per 15 minutes
- **Automatic unlock**: Blocks expire after timeout
- **Skip successful requests**: Successful logins don't count toward limit

### 2. Log Data Protection
- **Admin only**: Chỉ admin xem được logs
- **IP logging**: Track login source
- **User agent**: Detect automation
- **TTL**: Auto delete logs sau 90 ngày

### 3. Information Disclosure Prevention
- **Generic error messages**: Không tiết lộ user có tồn tại hay không
- **Same response time**: Login failed vs user not found

## Performance Considerations

### 1. Database Indexing
```javascript
// Critical indexes
userId (ascending)
timestamp (descending)
action (ascending)
{ userId: 1, timestamp: -1 } (compound)
```

### 2. Query Optimization
```javascript
// Use lean() for read-only queries
Log.find().lean()

// Limit fields
Log.find().select('userId action timestamp')

// Use aggregation for stats
Log.aggregate([...])
```

### 3. Rate Limiter Storage
- **Redis**: Recommended for production (distributed, fast)
- **Memory**: OK for development (lost on restart)
- **MongoDB**: Alternative (slower but persistent)

## Monitoring & Alerts

### Suggested Metrics:
1. **Failed login rate**: Alert if > 50 per hour
2. **Rate limit hits**: Alert if > 100 per hour
3. **Suspicious IPs**: Multiple users from same IP
4. **Unusual activity**: Login from new location/device

### Log Analysis Queries:
```javascript
// Top failed login IPs
db.logs.aggregate([
  { $match: { action: 'failed_login' } },
  { $group: { _id: '$ipAddress', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])

// Login activity by hour
db.logs.aggregate([
  { $match: { action: 'login' } },
  { $group: { 
    _id: { $hour: '$timestamp' },
    count: { $sum: 1 }
  }}
])
```

## Future Enhancements

1. **Real-time Logs**: WebSocket for live log updates
2. **Advanced Filters**: Date range, IP range, user search
3. **Export Logs**: CSV/JSON export cho audit
4. **Geo-location**: Show login location on map
5. **Anomaly Detection**: ML-based suspicious activity detection
6. **CAPTCHA**: Add after N failed attempts
7. **2FA Requirement**: Force 2FA after suspicious activity

---

**Tác giả**: SV2 - Frontend Developer  
**Ngày tạo**: 2024  
**Phiên bản**: 1.0  
**Branch**: `feature/log-rate-limit`  
**Phối hợp**: SV1 (API & Middleware), SV3 (MongoDB & Testing)
