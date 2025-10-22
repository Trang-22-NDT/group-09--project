# Hệ thống Phân quyền RBAC (Role-Based Access Control)

## 📋 Mô tả
Hệ thống phân quyền nâng cao với 3 vai trò: **User**, **Moderator**, và **Admin**.

## 🎯 Mục tiêu
Triển khai hệ thống RBAC để quản lý quyền truy cập dựa trên vai trò người dùng.

## 👥 Phân công công việc

### SV1: Backend (Middleware & API)
- Middleware `checkRole(role)` để kiểm tra quyền
- API quản lý user với phân quyền

### SV2: Frontend (Giao diện người dùng) ✅
- **Component ProtectedRoute**: Bảo vệ route theo role
- **Admin Dashboard**: Trang quản lý dành cho Admin
- **Moderator Dashboard**: Trang quản lý dành cho Moderator
- **UI động**: Hiển thị menu và chức năng khác nhau theo role
- **AuthProvider**: Cập nhật context hỗ trợ role và hàm `hasRole()`

### SV3: Database
- Cập nhật schema User thêm trường `role`
- Thêm dữ liệu mẫu với các role

## 🚀 Các chức năng đã triển khai (Frontend)

### 1. Quản lý Role trong AuthProvider
```javascript
// Thêm hàm hasRole() để kiểm tra quyền
const hasRole = (allowedRoles) => {
  if (!user) return false
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(user.role)
  }
  return user.role === allowedRoles
}
```

### 2. Component ProtectedRoute
- Bảo vệ route theo role
- Redirect về login nếu chưa đăng nhập
- Hiển thị trang "Access Denied" nếu không có quyền

### 3. Admin Dashboard (`/admin`)
**Quyền hạn:**
- ✅ Xem danh sách tất cả người dùng
- ✅ Thay đổi role của người dùng
- ✅ Xóa người dùng khỏi hệ thống
- ✅ Quản lý toàn bộ hệ thống

### 4. Moderator Dashboard (`/moderator`)
**Quyền hạn:**
- ✅ Xem danh sách người dùng (không bao gồm Admin)
- ✅ Kiểm duyệt nội dung
- ❌ Không thể chỉnh sửa thông tin người dùng
- ❌ Không thể xem thông tin Admin

### 5. User Profile (`/profile`)
- Xem thông tin cá nhân
- Hiển thị role hiện tại
- Liệt kê quyền truy cập

### 6. UI động theo Role
- Menu navigation hiển thị dựa trên role
- Badge role trên header
- Link đến dashboard tương ứng

## 📦 Cấu trúc file

```
frontend/my-auth-app/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx        # Bảo vệ route theo role
│   ├── context/
│   │   └── AuthProvider.jsx          # Context quản lý auth & role
│   ├── pages/
│   │   ├── Login.jsx                 # Trang đăng nhập
│   │   ├── Signup.jsx                # Trang đăng ký
│   │   ├── Profile.jsx               # Trang profile (có hiển thị role)
│   │   ├── AdminDashboard.jsx        # Dashboard cho Admin
│   │   └── ModeratorDashboard.jsx    # Dashboard cho Moderator
│   └── App.jsx                       # Routes với ProtectedRoute
└── SAMPLE_DATA.md                    # Dữ liệu mẫu để test
```

## 🧪 Hướng dẫn Test

### 1. Cài đặt và chạy
```bash
cd frontend/my-auth-app
npm install
npm run dev
```

### 2. Thêm dữ liệu mẫu
Mở Console (F12) và chạy:
```javascript
const sampleUsers = [
  { name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" },
  { name: "Moderator User", email: "mod@example.com", password: "mod123", role: "moderator" },
  { name: "Normal User", email: "user@example.com", password: "user123", role: "user" }
];
localStorage.setItem('registeredUsers', JSON.stringify(sampleUsers));
```

### 3. Test các role

#### Test Admin
- Email: `admin@example.com`
- Password: `admin123`
- Kiểm tra:
  - ✅ Truy cập `/admin` thành công
  - ✅ Truy cập `/moderator` thành công
  - ✅ Xem tất cả users
  - ✅ Thay đổi role của user
  - ✅ Xóa user

#### Test Moderator
- Email: `mod@example.com`
- Password: `mod123`
- Kiểm tra:
  - ✅ Truy cập `/moderator` thành công
  - ❌ Không thể truy cập `/admin`
  - ✅ Xem users (không bao gồm admin)
  - ❌ Không thể chỉnh sửa user

#### Test User
- Email: `user@example.com`
- Password: `user123`
- Kiểm tra:
  - ✅ Truy cập `/profile` thành công
  - ❌ Không thể truy cập `/admin`
  - ❌ Không thể truy cập `/moderator`

## 📸 Screenshots để nộp

1. **Admin Dashboard**: Chụp màn hình quản lý users, thay đổi role
2. **Moderator Dashboard**: Chụp màn hình xem danh sách users
3. **Access Denied**: Chụp màn hình khi user thường cố truy cập admin
4. **Navigation Menu**: Chụp menu hiển thị khác nhau theo role
5. **Profile với Role**: Chụp trang profile hiển thị role badge

## 🔗 GitHub

### Branch
```bash
git checkout -b feature/rbac
```

### Commit
```bash
git add .
git commit -m "Thêm phân quyền RBAC"
```

### Push
```bash
git push origin feature/rbac
```

### Pull Request
Link PR: https://github.com/Trang-22-NDT/group-09--project/pull/new/feature/rbac

## 📊 Sản phẩm nộp

1. ✅ Ảnh chụp API kiểm tra quyền (cho SV1)
2. ✅ Demo frontend theo role:
   - Admin Dashboard với quản lý users
   - Moderator Dashboard với xem users
   - User profile với role badge
   - Access denied khi không có quyền
3. ✅ Link PR GitHub: https://github.com/Trang-22-NDT/group-09--project/pull/new/feature/rbac
4. ✅ Code đầy đủ trên branch `feature/rbac`

## 🛠️ Công nghệ sử dụng

- **React 19** - Framework
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **LocalStorage** - Mock database (development)
- **Vite** - Build tool

## 👨‍💻 Sinh viên thực hiện

**SV2 - Frontend Developer**
- Triển khai ProtectedRoute component
- Xây dựng Admin Dashboard
- Xây dựng Moderator Dashboard
- Cập nhật UI động theo role
- Tích hợp role vào AuthProvider

---

**Lưu ý**: Đây là phiên bản frontend với mock data. Khi có backend thật từ SV1, chỉ cần cập nhật các hàm trong `AuthProvider.jsx` để gọi API thật thay vì dùng localStorage.
