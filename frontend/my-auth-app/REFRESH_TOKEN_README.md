# Refresh Token & Session Management - Frontend

## 🎯 Mục tiêu
Triển khai cơ chế JWT Access Token + Refresh Token, duy trì session an toàn, tự động refresh token khi hết hạn.

## ✨ Tính năng đã triển khai

### 1. Axios Interceptor với Auto Refresh Token
**File**: `src/api/axios.js`

Tính năng:
- ✅ Tự động thêm Access Token vào header của mọi request
- ✅ Phát hiện khi Access Token hết hạn (401 error)
- ✅ Tự động gọi API `/auth/refresh` để lấy token mới
- ✅ Queue các request đang chờ trong lúc refresh
- ✅ Retry lại request gốc sau khi có token mới
- ✅ Redirect về login nếu refresh token cũng hết hạn

**Workflow:**
```
1. Request API với Access Token
2. Server trả về 401 (Token hết hạn)
3. Interceptor tự động gọi /auth/refresh
4. Nhận Access Token mới
5. Lưu token mới vào localStorage
6. Retry request gốc với token mới
7. Trả về kết quả cho người dùng
```

### 2. Token Management Utilities
**File**: `src/utils/tokenUtils.js`

Helper functions:
- ✅ `saveTokens()` - Lưu tokens vào localStorage
- ✅ `getTokens()` - Lấy tokens từ localStorage
- ✅ `clearTokens()` - Xóa tất cả tokens
- ✅ `isTokenValid()` - Kiểm tra token có hợp lệ
- ✅ `getTokenAge()` - Lấy thời gian token đã sử dụng
- ✅ `getLastRefreshTime()` - Thời gian refresh lần cuối

### 3. AuthProvider với Token Management
**File**: `src/context/AuthProvider.jsx`

Cải tiến:
- ✅ Sử dụng tokenUtils để quản lý tokens
- ✅ Lưu thời gian lưu token
- ✅ Clear tokens an toàn khi logout
- ✅ Xử lý lỗi tốt hơn khi load profile

### 4. Token Status Component
**File**: `src/components/TokenStatus.jsx`

Hiển thị:
- ✅ Thời gian token đã sử dụng (real-time)
- ✅ Thời gian refresh token lần cuối
- ✅ Trạng thái active với animation
- ✅ UI đẹp, compact ở góc màn hình

## 📦 Cấu trúc Files

```
src/
├── api/
│   └── axios.js                    # Axios interceptor với auto refresh
├── utils/
│   └── tokenUtils.js               # Token management utilities
├── components/
│   └── TokenStatus.jsx             # UI hiển thị token status
├── context/
│   └── AuthProvider.jsx            # Auth context với token management
└── App.jsx                         # Thêm TokenStatus component
```

## 🔧 Cách hoạt động

### Khi đăng nhập:
1. User nhập email/password
2. Server trả về `accessToken` và `refreshToken`
3. Frontend lưu vào localStorage với timestamp
4. TokenStatus bắt đầu hiển thị thông tin

### Khi gọi API:
1. Axios tự động thêm `Authorization: Bearer {accessToken}`
2. Nếu server trả về 401:
   - Tự động gọi `/auth/refresh` với refreshToken
   - Nhận token mới
   - Retry request gốc
3. User không biết gì, mọi thứ trong suốt

### Khi logout:
1. Gọi API `/auth/logout` để revoke token
2. Xóa tất cả tokens khỏi localStorage
3. Clear user state
4. Redirect về login

## 🧪 Hướng dẫn Test

### 1. Chạy Frontend
```bash
cd my-auth-app
npm run dev
```

### 2. Test Auto Refresh Token

#### Cách 1: Mock trong localStorage
Mở Console (F12) và chạy:
```javascript
// Thêm user test
const users = [
  { name: "Test User", email: "test@example.com", password: "123456", role: "user" }
];
localStorage.setItem('registeredUsers', JSON.stringify(users));

// Đăng nhập
// Sau đó xóa accessToken để test refresh
setTimeout(() => {
  localStorage.removeItem('accessToken');
  console.log('Access token removed - next API call will trigger refresh');
}, 5000);
```

#### Cách 2: Xem Token Status
1. Đăng nhập vào hệ thống
2. Quan sát component TokenStatus ở góc dưới bên phải
3. Thấy thời gian token tăng dần
4. Khi có API call và refresh, sẽ thấy "Last Refresh" cập nhật

### 3. Test với Backend thật
Khi có backend:
1. Cập nhật `API_BASE` trong `axios.js`
2. Backend cần có endpoint:
   - `POST /auth/login` - Trả về accessToken & refreshToken
   - `POST /auth/refresh` - Nhận refreshToken, trả về token mới
   - `POST /auth/logout` - Revoke refresh token
   - `GET /user/profile` - API test với auth

## 📸 Features Demo

### Token Status Component
- Hiển thị real-time token age
- Cập nhật mỗi giây
- Hiện thị thời gian refresh lần cuối
- Animation "Active" status

### Auto Refresh Demo
1. Token hết hạn → API trả về 401
2. Tự động gọi /auth/refresh
3. Nhận token mới
4. Retry request gốc
5. User không bị ngắt quãng

## 🔐 Security Features

### Token Storage
- ✅ Lưu tokens trong localStorage (có thể nâng cấp lên httpOnly cookie)
- ✅ Lưu timestamp để tracking
- ✅ Clear tokens khi logout hoặc refresh fail

### Auto Refresh
- ✅ Tự động refresh khi 401
- ✅ Queue requests trong lúc refresh
- ✅ Chỉ refresh 1 lần dù có nhiều request đồng thời
- ✅ Redirect về login nếu refresh fail

### Error Handling
- ✅ Xử lý khi không có refresh token
- ✅ Xử lý khi refresh token hết hạn
- ✅ Xử lý network errors
- ✅ Clean up và redirect khi cần

## 🚀 Nâng cấp trong tương lai

1. **HttpOnly Cookies**: Lưu refresh token trong httpOnly cookie thay vì localStorage
2. **Token Expiry Tracking**: Decode JWT để biết chính xác thời gian hết hạn
3. **Proactive Refresh**: Refresh token trước khi hết hạn (ví dụ: còn 5 phút)
4. **Fingerprinting**: Thêm device fingerprint để bảo mật
5. **Multiple Tabs**: Sync tokens giữa các tabs

## 👨‍💻 Developer Notes

### Khi tích hợp Backend:
1. Đổi `API_BASE` trong `axios.js`
2. Đảm bảo backend có endpoint `/auth/refresh`
3. Format response phải có: `{ accessToken, refreshToken }`
4. Backend cần lưu refresh token trong database
5. Implement token revocation khi logout

### Best Practices:
- ✅ Luôn clear tokens khi logout
- ✅ Handle errors gracefully
- ✅ Log refresh events (development only)
- ✅ Test với expired tokens
- ✅ Monitor refresh frequency

---

**Lưu ý**: Đây là implementation cho development/demo. Production cần:
- HTTPS bắt buộc
- HttpOnly cookies cho refresh token
- Rate limiting cho refresh endpoint
- Token rotation
- Proper error monitoring
