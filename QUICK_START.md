# 🚀 Quick Start Guide - User Management System

## ⚡ Khởi động nhanh trong 5 phút

### Prerequisites
- ✅ Node.js v14+ đã cài
- ✅ MongoDB đã cài (local) hoặc MongoDB Atlas account
- ✅ Git đã cài

---

## 📦 Bước 1: Clone & Install (2 phút)

```bash
# Clone repository
git clone https://github.com/Trang-22-NDT/group-09--project.git
cd group-09--project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend/my-auth-app
npm install
```

---

## ⚙️ Bước 2: Cấu hình Environment (1 phút)

### Backend `.env`
Tạo file `backend/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/user-management
# Hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_REFRESH_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend
FRONTEND_URL=http://localhost:5173

# Reset Password
RESET_PASSWORD_EXPIRE=3600000
```

### Frontend `.env`
Tạo file `frontend/my-auth-app/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Bước 3: Chạy ứng dụng (1 phút)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend running at: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend/my-auth-app
npm run dev
```
✅ Frontend running at: http://localhost:5173

---

## ✅ Bước 4: Kiểm tra (1 phút)

1. Mở browser: http://localhost:5173
2. Thử đăng ký tài khoản mới
3. Đăng nhập
4. Check profile page

**🎉 Done! Ứng dụng đã chạy thành công!**

---

## 🧪 Test nhanh với Postman

1. Mở Postman
2. Import collection (nếu có) hoặc tạo requests thủ công
3. Tạo environment với:
   - `base_url`: `http://localhost:5000/api`
4. Test các endpoints:

### Sign Up
```
POST {{base_url}}/auth/signup
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@123456",
  "role": "user"
}
```

### Login
```
POST {{base_url}}/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "Test@123456"
}
```

### Get Profile (cần token)
```
GET {{base_url}}/users/profile
Headers:
Authorization: Bearer {your_access_token}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod

# Or use MongoDB Atlas cloud
```

### Port Already in Use
```bash
# Backend (Port 5000)
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Frontend (Port 5173)
# Same process but with port 5173
```

### Email Not Sending
```
# Use Gmail with App Password
1. Enable 2FA on Gmail
2. Generate App Password
3. Use App Password in EMAIL_PASS
```

### Cloudinary Upload Fail
```
# Check credentials
1. Login to cloudinary.com
2. Go to Dashboard
3. Copy Cloud Name, API Key, API Secret
4. Update .env file
```

---

## 📚 Tài liệu chi tiết

Để tìm hiểu thêm, xem các file:

- 📄 **README.md** - Tài liệu đầy đủ
- 📮 **POSTMAN_GUIDE.md** - Hướng dẫn test API
- 🧪 **TESTING_GUIDE.md** - Test flows chi tiết
- 🎥 **DEMO_CHECKLIST.md** - Chuẩn bị demo
- 📊 **HOAT_DONG_7_SUMMARY.md** - Tóm tắt hoàn thành

---

## 🎯 Các tính năng có sẵn

### Authentication
- ✅ Đăng ký / Đăng nhập
- ✅ JWT Authentication
- ✅ Refresh Token
- ✅ Quên mật khẩu (Email)
- ✅ Reset mật khẩu

### User Management
- ✅ Xem profile
- ✅ Cập nhật thông tin
- ✅ Upload avatar (Cloudinary)

### Admin Features
- ✅ Quản lý users
- ✅ Phân quyền (RBAC)
- ✅ Xóa/sửa users

### Security
- ✅ Password hashing
- ✅ Rate limiting
- ✅ Request logging
- ✅ CORS protection

---

## 🎓 Sample Accounts

Sau khi chạy lần đầu, tạo các tài khoản test:

### Admin Account
```
Email: admin@example.com
Password: Admin@123456
Role: admin
```

### User Account
```
Email: user@example.com
Password: User@123456
Role: user
```

---

## 💡 Tips

1. **Development**
   - Backend auto-restarts với nodemon
   - Frontend hot-reload với Vite
   - Check terminal logs để debug

2. **Testing**
   - Use Postman for API testing
   - Test frontend UI manually
   - Check browser DevTools console

3. **Database**
   - Use MongoDB Compass để view data
   - Collections: users
   - Check tokens và password hashing

---

## 📞 Support

Nếu gặp vấn đề:
1. Check terminal logs (backend & frontend)
2. Check browser console (F12)
3. Verify .env files
4. Read TROUBLESHOOTING section in README.md
5. Contact team members

---

## ✨ Features Demo Flow

### Quick Demo (5 phút):
1. **Sign Up** → Create new account
2. **Login** → Get tokens
3. **Profile** → View info
4. **Upload Avatar** → Test Cloudinary
5. **Admin** → Login as admin, view users

### Full Demo (15 phút):
Follow **DEMO_CHECKLIST.md** for complete script

---

## 🔗 Useful Links

- **GitHub**: https://github.com/Trang-22-NDT/group-09--project
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: See POSTMAN_GUIDE.md

---

## 🎬 Next Steps

1. ✅ Project running successfully
2. 📖 Read README.md for full documentation
3. 🧪 Test all features following TESTING_GUIDE.md
4. 🎥 Prepare demo using DEMO_CHECKLIST.md
5. 🚀 Deploy (optional)

---

**Happy Coding! 🎉**

*Need help? Check README.md or contact team.*
