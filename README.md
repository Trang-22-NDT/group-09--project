# 🚀 User Management System - Group 09

##  Thành viên nhóm

## 📋 Mục lục| STT | Họ và tên | Vai trò | Phụ trách |

- [Giới thiệu](#giới-thiệu)|-----|------------|----------|------------|

- [Tính năng](#tính-năng)| 1 | [Mai Văn Vàng] | Frontend |

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)| 2 | [Nguyễn Đoan Trang] | Backend |

- [Cài đặt](#cài-đặt)| 3 | [Nguyễn Văn Khánh] | Database | 

- [Chạy ứng dụng](#chạy-ứng-dụng)

- [API Endpoints](#api-endpoints)---

- [Cấu trúc dự án](#cấu-trúc-dự-án)

- [Testing](#testing)##  Công nghệ sử dụng 

- [Team Members](#team-members)- **Quản lý mã nguồn:** Git (Branch, Merge, Pull Request, Conflict Resolve)



------



## 🎯 Giới thiệu##  Hướng dẫn chạy dự án

### 🔹 Bước 1: Clone dự án về máy

**User Management System** là một ứng dụng web full-stack hiện đại, được xây dựng với mục đích quản lý người dùng với đầy đủ các tính năng bảo mật và authentication tiên tiến.```bash

git clone https://github.com/<username>/<repo-name>.git

Dự án này được phát triển bởi **Group 09** như một phần của bài tập nhóm, tích hợp nhiều tính năng nâng cao về xác thực, phân quyền và quản lý người dùng.

<<<<<<< HEAD

---# group-09--project

Mai Văn Vàng tạo : Fronten

## ✨ Tính năng=======

<<<<<<< HEAD

### 🔐 Authentication & Authorization(nội dung phiên bản hiện tại)

- ✅ **Đăng ký tài khoản** (Sign Up) với validation đầy đủ=======

- ✅ **Đăng nhập** (Login) với JWT Token(nội dung phiên bản commit e5abd5d)

- ✅ **Refresh Token** - Tự động làm mới token khi hết hạn>>>>>>> e5abd5d

- ✅ **Quên mật khẩu** (Forgot Password) - Gửi email reset link>>>>>>> backend

- ✅ **Reset mật khẩu** (Reset Password) - Đặt lại mật khẩu mới
- ✅ **Protected Routes** - Bảo vệ các route yêu cầu đăng nhập

### 👤 User Management
- ✅ **Profile Management** - Xem và cập nhật thông tin cá nhân
- ✅ **Avatar Upload** - Upload ảnh đại diện lên Cloudinary
- ✅ **Role-Based Access Control (RBAC)** - Phân quyền theo vai trò
  - Admin: Toàn quyền quản lý hệ thống
  - User: Quyền hạn cơ bản

### 🛡️ Security Features
- ✅ **Rate Limiting** - Giới hạn số request để chống spam/DOS
- ✅ **Request Logging** - Ghi log tất cả các request
- ✅ **Password Hashing** - Mã hóa mật khẩu với bcrypt
- ✅ **JWT Authentication** - Xác thực bảo mật với token
- ✅ **CORS Protection** - Bảo vệ cross-origin requests

### 🎨 Frontend Features
- ✅ **Redux State Management** - Quản lý state tập trung
- ✅ **React Router** - Điều hướng SPA
- ✅ **Responsive Design** - Giao diện responsive với Tailwind CSS
- ✅ **Form Validation** - Validate form phía client
- ✅ **Loading States** - Hiển thị trạng thái loading
- ✅ **Error Handling** - Xử lý lỗi thân thiện

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Cloudinary** - Image upload and storage
- **Express Rate Limit** - Rate limiting middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Development Tools
- **Nodemon** - Auto-restart server
- **Postman** - API testing
- **Git** - Version control
- **GitHub** - Code hosting

---

## 📦 Cài đặt

### Prerequisites
Đảm bảo bạn đã cài đặt:
- Node.js (v14 hoặc cao hơn)
- npm hoặc yarn
- MongoDB (local hoặc cloud)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Trang-22-NDT/group-09--project.git
cd group-09--project
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```

### 3. Cài đặt Frontend
```bash
# Từ thư mục gốc
cd frontend/my-auth-app
npm install
```

### 4. Cấu hình Environment Variables

#### Backend (.env)
Tạo file `.env` trong thư mục `backend`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Reset Password
RESET_PASSWORD_EXPIRE=3600000
```

#### Frontend (.env)
Tạo file `.env` trong thư mục `frontend/my-auth-app`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Chạy ứng dụng

### 1. Khởi động Backend
```bash
cd backend
npm run dev
```
Server sẽ chạy tại: `http://localhost:5000`

### 2. Khởi động Frontend
Mở terminal mới:
```bash
cd frontend/my-auth-app
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

### 3. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`
Đăng ký tài khoản mới
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "user"
}
```

#### POST `/api/auth/login`
Đăng nhập
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### POST `/api/auth/refresh`
Làm mới access token
```json
{
  "refreshToken": "your_refresh_token"
}
```

#### POST `/api/auth/forgot-password`
Yêu cầu reset mật khẩu
```json
{
  "email": "john@example.com"
}
```

#### POST `/api/auth/reset-password/:resetToken`
Đặt lại mật khẩu mới
```json
{
  "password": "NewPassword123!"
}
```

#### POST `/api/auth/logout`
Đăng xuất (yêu cầu authentication)

### User Routes (`/api/users`)

#### GET `/api/users/profile`
Lấy thông tin profile (yêu cầu authentication)

#### PUT `/api/users/profile`
Cập nhật profile (yêu cầu authentication)
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

#### POST `/api/users/upload-avatar`
Upload avatar (yêu cầu authentication)
- Form-data với key `avatar` (file image)

#### GET `/api/users` 
Lấy danh sách tất cả users (yêu cầu admin role)

#### PUT `/api/users/:id`
Cập nhật user (yêu cầu admin role)

#### DELETE `/api/users/:id`
Xóa user (yêu cầu admin role)

---

## 📁 Cấu trúc dự án

```
group-09--project/
├── backend/
│   ├── config/
│   │   ├── database.js          # Kết nối MongoDB
│   │   └── cloudinary.js        # Cấu hình Cloudinary
│   ├── controllers/
│   │   ├── authController.js    # Logic xác thực
│   │   └── userController.js    # Logic quản lý user
│   ├── middleware/
│   │   └── authMiddleware.js    # Middleware xác thực
│   ├── models/
│   │   └── User.js              # Schema User
│   ├── routes/
│   │   ├── authRoutes.js        # Routes xác thực
│   │   └── userRoutes.js        # Routes user
│   ├── utils/
│   │   └── sendEmail.js         # Utility gửi email
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point
│   └── package.json
│
├── frontend/
│   └── my-auth-app/
│       ├── public/
│       ├── src/
│       │   ├── api/
│       │   │   └── axios.js     # Axios config
│       │   ├── components/
│       │   │   ├── PrivateRoute.jsx
│       │   │   └── ...
│       │   ├── context/
│       │   │   └── AuthContext.jsx
│       │   ├── pages/
│       │   │   ├── Login.jsx
│       │   │   ├── Signup.jsx
│       │   │   ├── Profile.jsx
│       │   │   ├── ForgotPassword.jsx
│       │   │   ├── ResetPassword.jsx
│       │   │   └── AdminUsers.jsx
│       │   ├── redux/
│       │   │   ├── store.js
│       │   │   └── slices/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── .env
│       ├── vite.config.js
│       └── package.json
│
├── .gitignore
└── README.md
```

---

## 🧪 Testing

### Testing với Postman

1. **Import Postman Collection**
   - Xem file `POSTMAN_GUIDE.md` để biết chi tiết

2. **Test Flow cơ bản:**
   - Đăng ký tài khoản mới
   - Đăng nhập và nhận token
   - Sử dụng token để truy cập protected routes
   - Test refresh token
   - Test upload avatar
   - Test forgot/reset password

### Testing Frontend

1. **Đăng ký và Đăng nhập**
   - Truy cập `/signup`
   - Điền form và đăng ký
   - Đăng nhập tại `/login`

2. **Profile Management**
   - Xem profile tại `/profile`
   - Upload avatar
   - Cập nhật thông tin

3. **Admin Features** (với tài khoản admin)
   - Truy cập `/admin/users`
   - Xem danh sách users
   - Cập nhật/xóa users

4. **Password Reset**
   - Click "Forgot Password" tại trang login
   - Nhập email và nhận link reset
   - Đặt lại mật khẩu mới

---

## 📊 Features Chi tiết

### 1. Refresh Token Flow
- Access token có thời hạn ngắn (24h)
- Refresh token có thời hạn dài (7d)
- Tự động làm mới token khi hết hạn
- Logout sẽ xóa cả access và refresh token

### 2. Avatar Upload
- Upload lên Cloudinary
- Tự động resize và optimize
- Lưu URL trong database
- Hiển thị preview trước khi upload

### 3. Forgot Password Flow
1. User nhập email
2. Server tạo reset token và gửi email
3. User click link trong email
4. Điền mật khẩu mới
5. Token được verify và mật khẩu được cập nhật

### 4. Rate Limiting
- Giới hạn 100 requests/15 phút cho mỗi IP
- Áp dụng cho tất cả routes
- Trả về lỗi 429 khi vượt giới hạn

### 5. Request Logging
- Log tất cả requests với Morgan
- Format: `:method :url :status :response-time ms`
- Giúp debug và monitor

### 6. Role-Based Access Control
- **User role**: Truy cập profile, upload avatar
- **Admin role**: Quản lý tất cả users, view logs

---

## 🔍 Troubleshooting

### Backend không kết nối được MongoDB
```bash
# Kiểm tra MONGO_URI trong .env
# Đảm bảo MongoDB đang chạy
# Check network access trong MongoDB Atlas
```

### Frontend không gọi được API
```bash
# Kiểm tra VITE_API_URL trong .env
# Đảm bảo backend đang chạy
# Check CORS settings trong backend
```

### Email không gửi được
```bash
# Kiểm tra EMAIL_* variables trong .env
# Đảm bảo dùng App Password cho Gmail
# Check 2FA settings
```

### Cloudinary upload fail
```bash
# Kiểm tra CLOUDINARY_* variables
# Đảm bảo API key đúng
# Check upload preset settings
```

---

## 📝 Các tài liệu liên quan

- [REFRESH_TOKEN_README.md](./frontend/my-auth-app/REFRESH_TOKEN_README.md) - Chi tiết về Refresh Token
- [AVATAR_UPLOAD_README.md](./frontend/my-auth-app/AVATAR_UPLOAD_README.md) - Hướng dẫn Upload Avatar
- [FORGOT_PASSWORD_README.md](./frontend/my-auth-app/FORGOT_PASSWORD_README.md) - Flow Forgot Password
- [LOGGING_RATE_LIMIT_README.md](./frontend/my-auth-app/LOGGING_RATE_LIMIT_README.md) - Logging và Rate Limit
- [RBAC_FRONTEND_README.md](./frontend/my-auth-app/RBAC_FRONTEND_README.md) - Role-Based Access Control
- [REDUX_PROTECTED_README.md](./frontend/my-auth-app/REDUX_PROTECTED_README.md) - Redux và Protected Routes
- [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Hướng dẫn test với Postman
- [DEMO_CHECKLIST.md](./DEMO_CHECKLIST.md) - Checklist cho video demo

---

## 👥 Team Members - Group 09

| STT | Họ và tên | Vai trò | Phụ trách |
|-----|------------|----------|------------|
| 1 | Mai Văn Vàng | Frontend Developer | React, Redux, UI/UX |
| 2 | Nguyễn Đoan Trang | Backend Developer | Node.js, Express, API |
| 3 | Nguyễn Văn Khánh | Database & DevOps | MongoDB, Deployment |

---

## 📄 License

This project is created for educational purposes.

---

## 🌟 Features Highlights

### Security First
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Secure password reset flow

### Modern Tech Stack
- React with Hooks and Context
- Redux Toolkit for state management
- MongoDB with Mongoose ODM
- Express.js RESTful API
- Cloudinary for media management

### Developer Friendly
- Clean code structure
- Comprehensive documentation
- Easy setup and deployment
- Postman collection for API testing
- Environment-based configuration

---

## 🎥 Demo Video

Video demo đầy đủ chức năng: [Link to video]

Screenshots:
- Login Page
- Signup Page
- Profile Page
- Admin Dashboard
- Forgot Password Flow

---

## 📞 Contact & Support

Nếu có vấn đề hoặc câu hỏi, vui lòng:
1. Tạo issue trên GitHub
2. Liên hệ team qua email
3. Check tài liệu trong các README files

---

## 🚀 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Real-time notifications
- [ ] Activity logs dashboard
- [ ] Export user data
- [ ] Advanced search and filters
- [ ] Email verification
- [ ] Password strength meter
- [ ] Session management
- [ ] API versioning

---

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Best Practices](https://jwt.io/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Made with ❤️ by Group 09**

*Last updated: October 26, 2025*
