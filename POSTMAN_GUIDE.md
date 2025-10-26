# 📮 Hướng dẫn Test API với Postman

## 📋 Mục lục
- [Cài đặt và Chuẩn bị](#cài-đặt-và-chuẩn-bị)
- [Tạo Environment](#tạo-environment)
- [Test Authentication APIs](#test-authentication-apis)
- [Test User Management APIs](#test-user-management-apis)
- [Test với Admin Role](#test-với-admin-role)
- [Tips và Best Practices](#tips-và-best-practices)

---

## 🛠️ Cài đặt và Chuẩn bị

### 1. Cài đặt Postman
- Download từ: https://www.postman.com/downloads/
- Hoặc sử dụng Postman Web

### 2. Khởi động Backend
```bash
cd backend
npm run dev
```
Đảm bảo server chạy tại: `http://localhost:5000`

---

## 🌍 Tạo Environment

### Bước 1: Tạo Environment mới
1. Click vào icon ⚙️ (Settings) góc phải trên
2. Click "Add" để tạo environment mới
3. Đặt tên: `User Management - Local`

### Bước 2: Thêm Variables
| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api` | `http://localhost:5000/api` |
| `access_token` | (để trống) | (để trống) |
| `refresh_token` | (để trống) | (để trống) |
| `user_id` | (để trống) | (để trống) |
| `reset_token` | (để trống) | (để trống) |

### Bước 3: Lưu và chọn Environment
- Click "Save"
- Chọn environment vừa tạo từ dropdown góc phải trên

---

## 🔐 Test Authentication APIs

### 1. Đăng ký tài khoản (Sign Up)

**Endpoint:** `POST {{base_url}}/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "Test@123456",
  "role": "user"
}
```

**Expected Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "testuser@example.com",
    "role": "user"
  }
}
```

**Tests Script:**
```javascript
// Lưu user_id vào environment
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("user_id", response.user._id);
}
```

---

### 2. Đăng nhập (Login)

**Endpoint:** `POST {{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "testuser@example.com",
  "password": "Test@123456"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "testuser@example.com",
    "role": "user"
  }
}
```

**Tests Script:**
```javascript
// Lưu tokens vào environment
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.accessToken);
    pm.environment.set("refresh_token", response.refreshToken);
    pm.environment.set("user_id", response.user._id);
}

// Test assertions
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Response has access token", () => {
    pm.expect(pm.response.json()).to.have.property('accessToken');
});
```

---

### 3. Refresh Token

**Endpoint:** `POST {{base_url}}/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Expected Response (200):**
```json
{
  "accessToken": "new_access_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

**Tests Script:**
```javascript
// Cập nhật tokens mới
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.accessToken);
    pm.environment.set("refresh_token", response.refreshToken);
}
```

---

### 4. Quên mật khẩu (Forgot Password)

**Endpoint:** `POST {{base_url}}/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "testuser@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "Reset password email sent"
}
```

**Note:** 
- Check email để lấy reset token
- Hoặc check console/log của backend để lấy token
- Format: `http://localhost:5173/reset-password/{reset_token}`

---

### 5. Reset mật khẩu (Reset Password)

**Endpoint:** `POST {{base_url}}/auth/reset-password/:resetToken`

**URL Example:**
```
{{base_url}}/auth/reset-password/abc123xyz456token
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "password": "NewPassword@123"
}
```

**Expected Response (200):**
```json
{
  "message": "Password has been reset successfully"
}
```

---

### 6. Đăng xuất (Logout)

**Endpoint:** `POST {{base_url}}/auth/logout`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Tests Script:**
```javascript
// Xóa tokens sau khi logout
if (pm.response.code === 200) {
    pm.environment.unset("access_token");
    pm.environment.unset("refresh_token");
}
```

---

## 👤 Test User Management APIs

### 1. Lấy thông tin Profile

**Endpoint:** `GET {{base_url}}/users/profile`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Expected Response (200):**
```json
{
  "_id": "...",
  "username": "testuser",
  "email": "testuser@example.com",
  "role": "user",
  "avatar": "https://...",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

### 2. Cập nhật Profile

**Endpoint:** `PUT {{base_url}}/users/profile`

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "...",
    "username": "newusername",
    "email": "newemail@example.com",
    "role": "user"
  }
}
```

---

### 3. Upload Avatar

**Endpoint:** `POST {{base_url}}/users/upload-avatar`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| `avatar` | File | [Chọn file ảnh] |

**Expected Response (200):**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://res.cloudinary.com/..."
}
```

**Note:**
- File size tối đa: 5MB
- Format hỗ trợ: JPG, PNG, JPEG
- Ảnh sẽ được upload lên Cloudinary

---

## 👮 Test với Admin Role

### 1. Tạo Admin Account
Sử dụng endpoint Sign Up với `"role": "admin"`

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123456",
  "role": "admin"
}
```

### 2. Login với Admin
Đăng nhập với tài khoản admin để nhận admin token

### 3. Lấy danh sách Users

**Endpoint:** `GET {{base_url}}/users`

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Expected Response (200):**
```json
{
  "users": [
    {
      "_id": "...",
      "username": "user1",
      "email": "user1@example.com",
      "role": "user"
    },
    {
      "_id": "...",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  ]
}
```

---

### 4. Cập nhật User (Admin)

**Endpoint:** `PUT {{base_url}}/users/:userId`

**URL Example:**
```
{{base_url}}/users/{{user_id}}
```

**Headers:**
```
Authorization: Bearer {{access_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "updatedname",
  "role": "admin"
}
```

**Expected Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "...",
    "username": "updatedname",
    "role": "admin"
  }
}
```

---

### 5. Xóa User (Admin)

**Endpoint:** `DELETE {{base_url}}/users/:userId`

**URL Example:**
```
{{base_url}}/users/{{user_id}}
```

**Headers:**
```
Authorization: Bearer {{access_token}}
```

**Expected Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## 💡 Tips và Best Practices

### 1. Pre-request Scripts

Thêm vào Collection hoặc từng request để tự động kiểm tra token:

```javascript
// Auto-refresh token nếu hết hạn
const accessToken = pm.environment.get("access_token");
if (!accessToken) {
    console.log("No access token found. Please login first.");
}
```

### 2. Test Scripts Tổng hợp

```javascript
// Test chung cho mọi request
pm.test("Response time is less than 2000ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is JSON", () => {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});

// Test status code
pm.test("Status code is successful", () => {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
```

### 3. Collection Variables

Tạo collection với Pre-request Script:
```javascript
// Set base URL automatically
pm.collectionVariables.set("base_url", "http://localhost:5000/api");
```

### 4. Organize Collections

```
📁 User Management API
  📁 Authentication
    ├── Sign Up
    ├── Login
    ├── Refresh Token
    ├── Forgot Password
    ├── Reset Password
    └── Logout
  📁 User
    ├── Get Profile
    ├── Update Profile
    └── Upload Avatar
  📁 Admin
    ├── Get All Users
    ├── Update User
    └── Delete User
```

---

## 🧪 Test Flow Đầy đủ

### Flow 1: User Registration và Profile Management
1. **Sign Up** → Save user_id
2. **Login** → Save tokens
3. **Get Profile** → Verify user data
4. **Upload Avatar** → Check avatar URL
5. **Update Profile** → Verify changes
6. **Logout** → Clear tokens

### Flow 2: Password Reset
1. **Forgot Password** → Get reset link
2. **Copy reset token** từ email/console
3. **Reset Password** → Set new password
4. **Login** với password mới → Verify success

### Flow 3: Token Refresh
1. **Login** → Get tokens
2. **Wait hoặc modify token** để expire
3. **Refresh Token** → Get new tokens
4. **Use new token** → Access protected route

### Flow 4: Admin Operations
1. **Login as Admin** → Get admin token
2. **Get All Users** → View users list
3. **Update User** → Change user role
4. **Delete User** → Remove user

---

## 🐛 Troubleshooting

### 401 Unauthorized
- Check token đã được set trong environment chưa
- Token có thể đã hết hạn → Dùng refresh token
- Đảm bảo đã login và token được lưu đúng

### 403 Forbidden
- User không có quyền access endpoint (cần admin role)
- Check role trong response của login

### 500 Internal Server Error
- Check backend console logs
- Verify MongoDB connection
- Check environment variables (.env)

### Request Timeout
- Backend có đang chạy không?
- Check base_url đúng chưa
- Network connection OK?

---

## 📊 Sample Test Cases

### Test Case 1: Successful Registration
```
Given: Valid user data
When: POST /auth/signup
Then: Status 201, user created, no password in response
```

### Test Case 2: Duplicate Email
```
Given: Email đã tồn tại
When: POST /auth/signup
Then: Status 400, error message "Email already exists"
```

### Test Case 3: Invalid Token
```
Given: Invalid or expired token
When: GET /users/profile
Then: Status 401, error message "Invalid token"
```

### Test Case 4: Admin Access
```
Given: User role = "admin"
When: GET /users
Then: Status 200, return all users list
```

### Test Case 5: User Access Admin Route
```
Given: User role = "user"
When: GET /users
Then: Status 403, error message "Access denied"
```

---

## 📁 Export/Import Collection

### Export Collection
1. Click vào Collection → "..."  → Export
2. Chọn Collection v2.1
3. Save file JSON

### Import Collection
1. Click "Import" button
2. Chọn file JSON đã export
3. Collection sẽ được restore với tất cả requests

---

## 🎯 Kết luận

Với hướng dẫn này, bạn có thể:
- ✅ Test toàn bộ API endpoints
- ✅ Verify authentication flow
- ✅ Test authorization với roles
- ✅ Debug issues hiệu quả
- ✅ Document API cho team

**Happy Testing! 🚀**

---

*Last updated: October 26, 2025*
