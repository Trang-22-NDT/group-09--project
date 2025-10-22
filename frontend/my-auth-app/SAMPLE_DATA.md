# Dữ liệu mẫu để test hệ thống RBAC

Mở Console trong trình duyệt (F12) và chạy đoạn code sau để thêm dữ liệu mẫu:

```javascript
// Thêm dữ liệu mẫu với các role khác nhau
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Moderator User",
    email: "mod@example.com",
    password: "mod123",
    role: "moderator"
  },
  {
    name: "Normal User",
    email: "user@example.com",
    password: "user123",
    role: "user"
  },
  {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    password: "123456",
    role: "user"
  },
  {
    name: "Tran Thi B",
    email: "tranthib@example.com",
    password: "123456",
    role: "user"
  }
];

localStorage.setItem('registeredUsers', JSON.stringify(sampleUsers));
console.log('✅ Đã thêm dữ liệu mẫu thành công!');
console.log('Thông tin đăng nhập:');
console.log('Admin: admin@example.com / admin123');
console.log('Moderator: mod@example.com / mod123');
console.log('User: user@example.com / user123');
```

## Hướng dẫn test:

### 1. Test với Admin
- Email: `admin@example.com`
- Password: `admin123`
- Quyền: Truy cập tất cả trang, quản lý user, thay đổi role

### 2. Test với Moderator
- Email: `mod@example.com`
- Password: `mod123`
- Quyền: Xem danh sách user (không bao gồm admin), không thể chỉnh sửa

### 3. Test với User
- Email: `user@example.com`
- Password: `user123`
- Quyền: Chỉ xem profile cá nhân

## Kiểm tra chức năng:

1. ✅ Đăng nhập với từng role khác nhau
2. ✅ Kiểm tra menu hiển thị theo role
3. ✅ Truy cập `/admin` - chỉ Admin có quyền
4. ✅ Truy cập `/moderator` - Admin và Moderator có quyền
5. ✅ Admin có thể thay đổi role của user
6. ✅ Admin có thể xóa user
7. ✅ Moderator chỉ xem được, không chỉnh sửa
