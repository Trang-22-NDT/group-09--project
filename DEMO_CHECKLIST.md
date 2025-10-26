# 🎥 Checklist Demo Video & Testing

## 📋 Mục lục
- [Chuẩn bị trước Demo](#chuẩn-bị-trước-demo)
- [Script Demo Video](#script-demo-video)
- [Checklist Testing Đầy đủ](#checklist-testing-đầy-đủ)
- [Screenshots cần chụp](#screenshots-cần-chụp)
- [Tips quay Video](#tips-quay-video)

---

## ✅ Chuẩn bị trước Demo

### 1. Environment Setup
- [ ] Backend đang chạy (`http://localhost:5000`)
- [ ] Frontend đang chạy (`http://localhost:5173`)
- [ ] MongoDB connected
- [ ] Cloudinary configured
- [ ] Email service configured
- [ ] Postman ready với collection đầy đủ

### 2. Test Data Preparation
- [ ] Tạo sẵn 1-2 user accounts
- [ ] Tạo sẵn 1 admin account
- [ ] Có sẵn ảnh avatar để test upload
- [ ] Database có ít nhất 3-5 users

### 3. Browser & Tools
- [ ] Clear browser cache và cookies
- [ ] Mở DevTools (F12) để show Network/Console
- [ ] Screen recording software ready
- [ ] Postman window prepared
- [ ] Code editor (VS Code) với project opened

---

## 🎬 Script Demo Video

### Phần 1: Giới thiệu Dự án (2-3 phút)

#### 1.1. Opening
```
"Xin chào, chúng em là nhóm 09.
Hôm nay chúng em xin trình bày dự án User Management System.
Đây là một ứng dụng quản lý người dùng full-stack với đầy đủ 
tính năng authentication, authorization và security."
```

#### 1.2. Giới thiệu Tech Stack
**Show:** Slide hoặc README.md

```
"Dự án sử dụng:
- Backend: Node.js, Express, MongoDB
- Frontend: React, Redux Toolkit, Tailwind CSS
- Security: JWT, Bcrypt, Rate Limiting
- Cloud Services: Cloudinary, Email Service"
```

#### 1.3. Giới thiệu Features
**Show:** README.md - Tính năng section

```
"Các tính năng chính gồm:
1. Authentication: Đăng ký, đăng nhập, refresh token
2. Password Reset: Quên mật khẩu qua email
3. Profile Management: Upload avatar, cập nhật thông tin
4. Role-Based Access: Phân quyền admin và user
5. Security: Rate limiting, request logging"
```

---

### Phần 2: Demo Frontend (5-7 phút)

#### 2.1. Đăng ký tài khoản (Sign Up)
**Show:** Browser tại `/signup`

✅ Checklist:
- [ ] Navigate to signup page
- [ ] Show form validation (nhập sai format)
- [ ] Show error messages
- [ ] Nhập thông tin hợp lệ
- [ ] Submit form
- [ ] Show success message
- [ ] Auto redirect to login

**Script:**
```
"Đầu tiên, chúng ta sẽ đăng ký tài khoản mới.
Form có validation đầy đủ - nếu nhập sai format sẽ hiện lỗi.
Sau khi đăng ký thành công, hệ thống tự động chuyển sang trang đăng nhập."
```

#### 2.2. Đăng nhập (Login)
**Show:** Browser tại `/login`

✅ Checklist:
- [ ] Nhập email/password vừa đăng ký
- [ ] Submit form
- [ ] Show loading state
- [ ] **Open DevTools**: Show token được lưu trong localStorage
- [ ] Show successful login
- [ ] Redirect to profile/dashboard

**Script:**
```
"Bây giờ chúng ta đăng nhập với tài khoản vừa tạo.
Sau khi login, JWT token được lưu vào localStorage.
Token này sẽ được dùng để authenticate các request sau."
```

#### 2.3. Profile Management
**Show:** Browser tại `/profile`

✅ Checklist:
- [ ] Show user profile information
- [ ] Click "Upload Avatar"
- [ ] Select image file
- [ ] Show preview
- [ ] Upload và show loading
- [ ] Show new avatar
- [ ] Edit username/email
- [ ] Save changes
- [ ] Show success message

**Script:**
```
"Ở trang profile, user có thể:
- Xem thông tin cá nhân
- Upload avatar - ảnh được lưu trên Cloudinary
- Cập nhật username và email
Mọi thay đổi đều được validate và lưu vào database."
```

#### 2.4. Forgot Password Flow
**Show:** Browser tại `/forgot-password`

✅ Checklist:
- [ ] Click "Forgot Password" từ login page
- [ ] Nhập email
- [ ] Submit form
- [ ] Show success message
- [ ] **Open Email** hoặc **Show backend console** với reset link
- [ ] Copy reset link
- [ ] Navigate to reset password page
- [ ] Nhập mật khẩu mới
- [ ] Submit
- [ ] Show success
- [ ] Login với password mới

**Script:**
```
"Demo tính năng reset mật khẩu:
1. User nhập email
2. Hệ thống gửi email với reset link
3. User click link và đặt mật khẩu mới
4. Login thành công với password mới"
```

#### 2.5. Protected Routes
**Show:** Browser navigation

✅ Checklist:
- [ ] Try access `/profile` without login → Redirect to login
- [ ] Login successfully
- [ ] Can access `/profile`
- [ ] Logout
- [ ] Try access protected route → Blocked

**Script:**
```
"Các route như profile được bảo vệ.
Nếu chưa đăng nhập, sẽ tự động redirect về login page.
Sau khi logout, không thể truy cập các protected routes."
```

#### 2.6. Admin Dashboard
**Show:** Browser tại `/admin/users`

✅ Checklist:
- [ ] Logout user account
- [ ] Login với admin account
- [ ] Navigate to admin dashboard
- [ ] Show users list với role
- [ ] Edit một user (change role hoặc thông tin)
- [ ] Save changes
- [ ] Delete một user
- [ ] Confirm deletion
- [ ] User disappeared from list

**Script:**
```
"Admin có quyền cao hơn:
- Xem danh sách tất cả users
- Chỉnh sửa thông tin users
- Thay đổi role (user ↔ admin)
- Xóa users
User thường không thể truy cập các tính năng này."
```

---

### Phần 3: Demo Backend với Postman (5-7 phút)

#### 3.1. Setup và Environment
**Show:** Postman window

✅ Checklist:
- [ ] Show Postman collection structure
- [ ] Show environment variables
- [ ] Explain base_url, tokens

**Script:**
```
"Chúng ta đã tạo sẵn Postman collection để test API.
Environment variables giúp quản lý URL và tokens dễ dàng."
```

#### 3.2. Authentication APIs
**Show:** Postman requests

✅ Checklist:

**Sign Up:**
- [ ] Show request body
- [ ] Send request
- [ ] Show 201 response
- [ ] Point out user_id trong response

**Login:**
- [ ] Show request body
- [ ] Send request
- [ ] Show 200 response
- [ ] Show accessToken và refreshToken
- [ ] **Show Tests tab**: Token được lưu tự động

**Refresh Token:**
- [ ] Show request với refreshToken
- [ ] Send request
- [ ] Show new tokens

**Script:**
```
"Test các API authentication:
1. Sign up tạo user mới
2. Login nhận access và refresh tokens
3. Tokens được lưu tự động vào environment
4. Refresh token để lấy token mới khi hết hạn"
```

#### 3.3. Protected Routes
**Show:** Postman requests

✅ Checklist:

**Get Profile:**
- [ ] Show Authorization header với token
- [ ] Send request
- [ ] Show 200 response với user data

**Without Token:**
- [ ] Remove Authorization header
- [ ] Send request
- [ ] Show 401 Unauthorized

**Script:**
```
"Protected routes yêu cầu token:
- Có token hợp lệ → trả về data
- Không có token → 401 Unauthorized
- Token hết hạn → cần refresh"
```

#### 3.4. Upload Avatar
**Show:** Postman form-data

✅ Checklist:
- [ ] Show form-data với file upload
- [ ] Send request
- [ ] Show 200 response
- [ ] Show Cloudinary URL trong response

**Script:**
```
"Upload avatar qua API:
- Gửi file dạng form-data
- Backend xử lý và upload lên Cloudinary
- Trả về URL của ảnh đã upload"
```

#### 3.5. Admin Operations
**Show:** Postman requests

✅ Checklist:

**Get All Users (Admin):**
- [ ] Login as admin → get admin token
- [ ] Send GET /users
- [ ] Show 200 với users array

**Get All Users (Normal User):**
- [ ] Use normal user token
- [ ] Send GET /users
- [ ] Show 403 Forbidden

**Update User (Admin):**
- [ ] Send PUT /users/:id
- [ ] Show updated user response

**Delete User (Admin):**
- [ ] Send DELETE /users/:id
- [ ] Show success message

**Script:**
```
"Admin APIs demo role-based access control:
- Admin có thể get all users, update, delete
- User thường không có quyền này → 403 Forbidden"
```

---

### Phần 4: Code Walkthrough (3-5 phút)

#### 4.1. Backend Structure
**Show:** VS Code - backend folder

✅ Checklist:
- [ ] Show folder structure
- [ ] Open `server.js` - entry point
- [ ] Open `routes/authRoutes.js` - explain routing
- [ ] Open `controllers/authController.js` - business logic
- [ ] Open `middleware/authMiddleware.js` - JWT verification
- [ ] Open `models/User.js` - Schema

**Script:**
```
"Cấu trúc backend theo MVC pattern:
- Models: Define data schema
- Routes: Endpoint definitions  
- Controllers: Business logic
- Middleware: Authentication, validation
- Config: Database, services"
```

#### 4.2. Key Features Code

**JWT Authentication:**
```javascript
// Show trong authMiddleware.js
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

**Password Hashing:**
```javascript
// Show trong User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
```

**Rate Limiting:**
```javascript
// Show trong server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

#### 4.3. Frontend Structure
**Show:** VS Code - frontend folder

✅ Checklist:
- [ ] Show folder structure
- [ ] Open `App.jsx` - routing setup
- [ ] Open `redux/store.js` - state management
- [ ] Open `components/PrivateRoute.jsx` - route protection
- [ ] Open `pages/Login.jsx` - form handling

**Script:**
```
"Frontend sử dụng React với:
- Redux Toolkit cho state management
- React Router cho navigation
- Axios cho API calls
- Tailwind CSS cho styling
- Context API cho authentication state"
```

---

### Phần 5: Security Features Demo (2-3 phút)

#### 5.1. Rate Limiting
**Show:** Postman hoặc Browser DevTools

✅ Checklist:
- [ ] Gửi nhiều requests liên tiếp (>100 trong 15 phút)
- [ ] Show 429 Too Many Requests
- [ ] Explain rate limit settings

**Script:**
```
"Demo rate limiting để chống spam:
- Giới hạn 100 requests/15 phút
- Vượt quá → 429 Too Many Requests
- Headers show remaining requests"
```

#### 5.2. Request Logging
**Show:** Backend console/terminal

✅ Checklist:
- [ ] Gửi vài requests từ Postman
- [ ] Show logs trong terminal
- [ ] Explain log format: method, URL, status, time

**Script:**
```
"Mọi request đều được log:
- Method, URL, status code
- Response time
- Giúp monitor và debug"
```

#### 5.3. Token Security
**Show:** Browser DevTools + Code

✅ Checklist:
- [ ] Show token trong localStorage
- [ ] Show token expiration
- [ ] Show refresh token flow
- [ ] Explain why use refresh tokens

**Script:**
```
"Security với JWT:
- Access token ngắn hạn (24h)
- Refresh token dài hạn (7d)
- Auto-refresh khi token hết hạn
- Logout xóa tokens"
```

---

### Phần 6: Kết thúc (1-2 phút)

#### 6.1. Tổng kết Features
```
"Tóm lại, dự án đã implement:
✅ Full authentication flow
✅ Role-based access control
✅ File upload với Cloudinary
✅ Email service
✅ Security features (rate limit, logging)
✅ Responsive UI với React & Tailwind
✅ RESTful API với proper error handling"
```

#### 6.2. Challenges & Learning
```
"Trong quá trình làm, nhóm đã học được:
- Cách implement JWT authentication
- State management với Redux
- File upload và cloud storage
- API security best practices
- Team collaboration với Git"
```

#### 6.3. Future Improvements
```
"Hướng phát triển tiếp theo:
- Two-factor authentication
- Social login (Google, Facebook)
- Real-time notifications
- Advanced admin dashboard
- API documentation với Swagger"
```

#### 6.4. Q&A
```
"Cảm ơn các thầy cô đã theo dõi.
Nhóm em sẵn sàng trả lời câu hỏi ạ."
```

---

## ✅ Checklist Testing Đầy đủ

### Frontend Testing

#### Authentication
- [ ] Sign up với valid data → Success
- [ ] Sign up với email trùng → Error
- [ ] Sign up với password yếu → Validation error
- [ ] Login với đúng credentials → Success
- [ ] Login với sai credentials → Error
- [ ] Logout → Clear tokens, redirect to login

#### Profile Management
- [ ] View profile → Show user data
- [ ] Update username → Success
- [ ] Update email → Success
- [ ] Upload avatar (JPG) → Success
- [ ] Upload file quá lớn → Error
- [ ] Upload file không phải ảnh → Error

#### Password Reset
- [ ] Request reset với email valid → Success
- [ ] Request reset với email không tồn tại → Error
- [ ] Reset với token hợp lệ → Success
- [ ] Reset với token hết hạn → Error
- [ ] Login với password mới → Success

#### Protected Routes
- [ ] Access /profile without login → Redirect to login
- [ ] Access /profile with login → Show profile
- [ ] Access /admin without admin role → 403
- [ ] Access /admin with admin role → Show dashboard

#### Admin Features
- [ ] View all users → Show list
- [ ] Edit user → Success
- [ ] Change user role → Success
- [ ] Delete user → Success
- [ ] Search/filter users → Working

### Backend Testing (Postman)

#### Authentication APIs
- [ ] POST /auth/signup → 201 Created
- [ ] POST /auth/login → 200 OK + tokens
- [ ] POST /auth/refresh → 200 OK + new tokens
- [ ] POST /auth/forgot-password → 200 OK
- [ ] POST /auth/reset-password/:token → 200 OK
- [ ] POST /auth/logout → 200 OK

#### User APIs
- [ ] GET /users/profile → 200 OK
- [ ] PUT /users/profile → 200 OK
- [ ] POST /users/upload-avatar → 200 OK

#### Admin APIs
- [ ] GET /users (admin) → 200 OK
- [ ] GET /users (user) → 403 Forbidden
- [ ] PUT /users/:id (admin) → 200 OK
- [ ] DELETE /users/:id (admin) → 200 OK

#### Error Handling
- [ ] Invalid token → 401 Unauthorized
- [ ] Missing token → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Invalid request body → 400 Bad Request
- [ ] Resource not found → 404 Not Found
- [ ] Server error → 500 Internal Server Error

#### Security
- [ ] Rate limiting → 429 after limit
- [ ] CORS → Proper headers
- [ ] Password hashing → Not plain text in DB
- [ ] Token expiration → Works correctly

---

## 📸 Screenshots cần chụp

### Frontend Screenshots
1. **Login Page**
   - [ ] Clean UI
   - [ ] Form validation errors
   - [ ] Success state

2. **Signup Page**
   - [ ] Form with all fields
   - [ ] Validation messages
   - [ ] Success redirect

3. **Profile Page**
   - [ ] User information display
   - [ ] Avatar display
   - [ ] Edit form

4. **Avatar Upload**
   - [ ] Before upload
   - [ ] Upload progress
   - [ ] After upload success

5. **Forgot Password**
   - [ ] Email input form
   - [ ] Success message
   - [ ] Email received

6. **Reset Password**
   - [ ] New password form
   - [ ] Success message

7. **Admin Dashboard**
   - [ ] Users list
   - [ ] Edit modal
   - [ ] Delete confirmation

### Backend Screenshots (Postman)
1. **Authentication Requests**
   - [ ] Sign up request & response
   - [ ] Login request & response
   - [ ] Refresh token request & response

2. **Protected Routes**
   - [ ] With valid token
   - [ ] Without token (401)
   - [ ] With expired token

3. **Admin Routes**
   - [ ] Admin access (200)
   - [ ] User access (403)

4. **Error Responses**
   - [ ] Various error codes
   - [ ] Error messages

### Code Screenshots
1. **Backend Structure**
   - [ ] Folder structure
   - [ ] Key files

2. **Frontend Structure**
   - [ ] Folder structure
   - [ ] Redux setup

3. **Key Code Snippets**
   - [ ] JWT middleware
   - [ ] Password hashing
   - [ ] Rate limiting
   - [ ] Protected route component

---

## 🎥 Tips quay Video

### Kỹ thuật
- [ ] Resolution: 1080p (1920x1080)
- [ ] FPS: 30 hoặc 60
- [ ] Audio: Clear, không nhiễu
- [ ] Screen recording software: OBS, Camtasia, hoặc Zoom

### Nội dung
- [ ] Speak clearly và không quá nhanh
- [ ] Point out key features bằng cursor
- [ ] Zoom in khi cần
- [ ] Pause giữa các sections
- [ ] Show errors và how to fix

### Editing
- [ ] Add intro slide (3-5s)
- [ ] Add text annotations cho features quan trọng
- [ ] Speed up boring parts (installation, waiting)
- [ ] Add background music (subtle, không quá to)
- [ ] Add outro với team info

### Duration
- Total: 15-20 phút
- Intro: 2-3 phút
- Frontend Demo: 5-7 phút
- Backend Demo: 5-7 phút
- Code Walkthrough: 3-5 phút
- Outro: 1-2 phút

---

## 📝 Pre-Demo Checklist

### 24 giờ trước
- [ ] Test toàn bộ features
- [ ] Fix mọi bugs
- [ ] Update README.md
- [ ] Prepare test data
- [ ] Practice demo script 2-3 lần

### 1 giờ trước
- [ ] Restart backend & frontend
- [ ] Clear database (optional, reset về initial state)
- [ ] Clear browser cache
- [ ] Close unnecessary apps
- [ ] Disable notifications
- [ ] Prepare backup plan (video demo recorded sẵn)

### Ngay trước demo
- [ ] Deep breath 😊
- [ ] Start screen recording
- [ ] Open all necessary windows
- [ ] Check audio levels
- [ ] Begin!

---

## 🎯 Scoring Criteria

### Functionality (40%)
- [ ] All features working
- [ ] No critical bugs
- [ ] Proper error handling
- [ ] Good user experience

### Code Quality (20%)
- [ ] Clean code structure
- [ ] Proper comments
- [ ] Following best practices
- [ ] Reusable components

### Security (15%)
- [ ] Authentication implemented
- [ ] Authorization working
- [ ] Input validation
- [ ] Security features (rate limit, etc.)

### Documentation (15%)
- [ ] README comprehensive
- [ ] Code comments
- [ ] API documentation
- [ ] Setup instructions

### Presentation (10%)
- [ ] Clear explanation
- [ ] Good demo flow
- [ ] Time management
- [ ] Q&A handling

---

**Good luck với demo! 🚀🎉**

*Last updated: October 26, 2025*
