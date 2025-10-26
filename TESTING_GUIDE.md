# 🧪 Testing Flow - Complete Guide

## 📋 Mục lục
- [Quick Start Testing](#quick-start-testing)
- [Backend Testing Flow](#backend-testing-flow)
- [Frontend Testing Flow](#frontend-testing-flow)
- [Integration Testing](#integration-testing)
- [Test Results Template](#test-results-template)

---

## ⚡ Quick Start Testing

### 1. Khởi động hệ thống
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend/my-auth-app
npm run dev
```

### 2. Kiểm tra Services
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:5173
- ✅ MongoDB: Connected
- ✅ Cloudinary: Configured

---

## 🔧 Backend Testing Flow

### Flow 1: Authentication Complete Cycle

#### Step 1: Sign Up
**Endpoint:** `POST /api/auth/signup`

**Test Case 1.1 - Valid Registration**
```json
{
  "username": "testuser1",
  "email": "testuser1@example.com",
  "password": "Test@123456",
  "role": "user"
}
```
✅ Expected: 201 Created, user object returned

**Test Case 1.2 - Duplicate Email**
```json
{
  "username": "testuser2",
  "email": "testuser1@example.com",
  "password": "Test@123456",
  "role": "user"
}
```
✅ Expected: 400 Bad Request, "Email already exists"

**Test Case 1.3 - Invalid Password**
```json
{
  "username": "testuser3",
  "email": "testuser3@example.com",
  "password": "weak",
  "role": "user"
}
```
✅ Expected: 400 Bad Request, validation error

---

#### Step 2: Login
**Endpoint:** `POST /api/auth/login`

**Test Case 2.1 - Valid Login**
```json
{
  "email": "testuser1@example.com",
  "password": "Test@123456"
}
```
✅ Expected: 200 OK, accessToken, refreshToken returned
💾 Save: `accessToken` và `refreshToken` vào environment

**Test Case 2.2 - Wrong Password**
```json
{
  "email": "testuser1@example.com",
  "password": "WrongPassword"
}
```
✅ Expected: 401 Unauthorized

**Test Case 2.3 - Non-existent Email**
```json
{
  "email": "nonexistent@example.com",
  "password": "Test@123456"
}
```
✅ Expected: 401 Unauthorized

---

#### Step 3: Access Protected Route
**Endpoint:** `GET /api/users/profile`

**Test Case 3.1 - With Valid Token**
Headers:
```
Authorization: Bearer {{accessToken}}
```
✅ Expected: 200 OK, user profile data

**Test Case 3.2 - Without Token**
No Authorization header
✅ Expected: 401 Unauthorized

**Test Case 3.3 - Invalid Token**
Headers:
```
Authorization: Bearer invalid_token_here
```
✅ Expected: 401 Unauthorized

---

#### Step 4: Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Test Case 4.1 - Valid Refresh Token**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```
✅ Expected: 200 OK, new accessToken and refreshToken
💾 Update: Tokens trong environment

**Test Case 4.2 - Invalid Refresh Token**
```json
{
  "refreshToken": "invalid_refresh_token"
}
```
✅ Expected: 401 Unauthorized

---

#### Step 5: Logout
**Endpoint:** `POST /api/auth/logout`

**Test Case 5.1 - Successful Logout**
Headers:
```
Authorization: Bearer {{accessToken}}
```
✅ Expected: 200 OK, "Logged out successfully"

**Test Case 5.2 - Access After Logout**
Try GET /api/users/profile với token cũ
✅ Expected: 401 Unauthorized (token đã bị blacklist)

---

### Flow 2: Password Reset Complete Cycle

#### Step 1: Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Test Case 1 - Valid Email**
```json
{
  "email": "testuser1@example.com"
}
```
✅ Expected: 200 OK, "Reset password email sent"
📧 Check: Email received hoặc console log có reset link

#### Step 2: Get Reset Token
- Check email hoặc backend console
- Extract token từ URL: `http://localhost:5173/reset-password/{TOKEN}`
- 💾 Save token vào environment: `{{resetToken}}`

#### Step 3: Reset Password
**Endpoint:** `POST /api/auth/reset-password/{{resetToken}}`

**Test Case 3.1 - Valid Reset**
```json
{
  "password": "NewPassword@123"
}
```
✅ Expected: 200 OK, "Password has been reset successfully"

**Test Case 3.2 - Expired Token**
Wait cho token expire hoặc dùng token cũ
✅ Expected: 400 Bad Request, "Invalid or expired token"

#### Step 4: Login with New Password
```json
{
  "email": "testuser1@example.com",
  "password": "NewPassword@123"
}
```
✅ Expected: 200 OK, successful login

---

### Flow 3: Profile Management

#### Step 1: Get Profile
**Endpoint:** `GET /api/users/profile`

Headers:
```
Authorization: Bearer {{accessToken}}
```
✅ Expected: 200 OK, user data

#### Step 2: Update Profile
**Endpoint:** `PUT /api/users/profile`

**Test Case 2.1 - Update Username**
```json
{
  "username": "updatedusername"
}
```
✅ Expected: 200 OK, updated user data

**Test Case 2.2 - Update Email**
```json
{
  "email": "newemail@example.com"
}
```
✅ Expected: 200 OK, email updated

**Test Case 2.3 - Duplicate Email**
```json
{
  "email": "existing@example.com"
}
```
✅ Expected: 400 Bad Request, "Email already exists"

#### Step 3: Upload Avatar
**Endpoint:** `POST /api/users/upload-avatar`

Headers:
```
Authorization: Bearer {{accessToken}}
```

Body (form-data):
- Key: `avatar`
- Type: File
- Value: [Select image file]

**Test Case 3.1 - Valid Image**
✅ Expected: 200 OK, Cloudinary URL returned

**Test Case 3.2 - Invalid File Type**
Upload .txt or .pdf file
✅ Expected: 400 Bad Request, "Invalid file type"

**Test Case 3.3 - File Too Large**
Upload file > 5MB
✅ Expected: 400 Bad Request, "File too large"

---

### Flow 4: Admin Operations

#### Step 1: Create Admin Account
**Endpoint:** `POST /api/auth/signup`

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123456",
  "role": "admin"
}
```
✅ Expected: 201 Created

#### Step 2: Login as Admin
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Admin@123456"
}
```
✅ Expected: 200 OK
💾 Save: `adminAccessToken`

#### Step 3: Get All Users (Admin)
**Endpoint:** `GET /api/users`

Headers:
```
Authorization: Bearer {{adminAccessToken}}
```
✅ Expected: 200 OK, array of all users

#### Step 4: Get All Users (Normal User)
Headers:
```
Authorization: Bearer {{accessToken}}
```
✅ Expected: 403 Forbidden

#### Step 5: Update User (Admin)
**Endpoint:** `PUT /api/users/{{user_id}}`

Headers:
```
Authorization: Bearer {{adminAccessToken}}
```

Body:
```json
{
  "role": "admin"
}
```
✅ Expected: 200 OK, user updated

#### Step 6: Delete User (Admin)
**Endpoint:** `DELETE /api/users/{{user_id}}`

Headers:
```
Authorization: Bearer {{adminAccessToken}}
```
✅ Expected: 200 OK, user deleted

#### Step 7: Delete User (Normal User)
Headers:
```
Authorization: Bearer {{accessToken}}
```
✅ Expected: 403 Forbidden

---

### Flow 5: Security Features

#### Test 1: Rate Limiting
**Action:** Gửi 101 requests trong vòng 1 phút

**Tool:** Postman Runner hoặc script
```javascript
// Collection Runner
// Set iterations: 101
// Delay: 0ms
```

✅ Expected: 
- Requests 1-100: 200 OK
- Request 101+: 429 Too Many Requests

#### Test 2: CORS
**Action:** Gửi request từ origin khác

Headers:
```
Origin: http://different-domain.com
```

✅ Expected: 
- Đúng origin (localhost:5173): Request successful
- Sai origin: CORS error

#### Test 3: Token Expiration
**Action:**
1. Login và lấy token
2. Đợi token hết hạn (hoặc modify exp trong token)
3. Gửi request với token đã hết hạn

✅ Expected: 401 Unauthorized, "Token expired"

---

## 🎨 Frontend Testing Flow

### Flow 1: Authentication UI

#### Test 1: Sign Up Page (`/signup`)

**Steps:**
1. Navigate to `/signup`
2. Try submit empty form
   ✅ Expected: Validation errors shown

3. Fill invalid email
   ✅ Expected: Email validation error

4. Fill weak password
   ✅ Expected: Password strength error

5. Fill all valid data
   ✅ Expected: Success message, redirect to login

6. Check backend: User created in database

---

#### Test 2: Login Page (`/login`)

**Steps:**
1. Navigate to `/login`
2. Try wrong credentials
   ✅ Expected: Error message displayed

3. Try correct credentials
   ✅ Expected: 
   - Success message
   - Token saved in localStorage
   - Redirect to profile/dashboard

4. Check DevTools → Application → localStorage
   ✅ Expected: `accessToken` and `refreshToken` present

---

#### Test 3: Protected Routes

**Steps:**
1. Open browser in incognito mode
2. Try access `/profile` directly
   ✅ Expected: Redirect to `/login`

3. Login successfully
4. Access `/profile`
   ✅ Expected: Profile page shown

5. Logout
6. Try access `/profile` again
   ✅ Expected: Redirect to `/login`

---

### Flow 2: Profile Management UI

#### Test 1: View Profile

**Steps:**
1. Login successfully
2. Navigate to `/profile`
3. Check all data displayed:
   - Username
   - Email
   - Role
   - Avatar (if any)
   - Created date

✅ Expected: All data correct

---

#### Test 2: Update Profile

**Steps:**
1. At `/profile`, click "Edit" button
2. Change username
3. Click "Save"
   ✅ Expected: Success message, UI updated

4. Refresh page
   ✅ Expected: New username persisted

5. Check backend: User updated in database

---

#### Test 3: Upload Avatar

**Steps:**
1. At `/profile`, click "Upload Avatar"
2. Select image file
   ✅ Expected: Preview shown

3. Click "Upload"
   ✅ Expected: 
   - Loading indicator
   - Success message
   - New avatar displayed

4. Check backend: Avatar URL saved

5. Check Cloudinary: Image uploaded

---

### Flow 3: Password Reset UI

#### Test 1: Forgot Password

**Steps:**
1. At `/login`, click "Forgot Password?"
2. Navigate to `/forgot-password`
3. Enter email
4. Submit
   ✅ Expected: "Email sent" message

5. Check email inbox
   ✅ Expected: Reset email received

---

#### Test 2: Reset Password

**Steps:**
1. Click link in reset email
2. Navigate to `/reset-password/:token`
3. Enter new password
4. Submit
   ✅ Expected: Success message, redirect to login

5. Login with new password
   ✅ Expected: Login successful

---

### Flow 4: Admin Dashboard UI

#### Test 1: Access Control

**Steps:**
1. Login as normal user
2. Try navigate to `/admin/users`
   ✅ Expected: 403 page or redirect

3. Logout, login as admin
4. Navigate to `/admin/users`
   ✅ Expected: Users list displayed

---

#### Test 2: Manage Users

**Steps:**
1. At `/admin/users`, view users list
   ✅ Expected: All users shown with roles

2. Click "Edit" on a user
   ✅ Expected: Edit modal opens

3. Change username or role
4. Save changes
   ✅ Expected: User updated in list

5. Click "Delete" on a user
   ✅ Expected: Confirmation modal

6. Confirm delete
   ✅ Expected: User removed from list

---

## 🔗 Integration Testing

### End-to-End Flow 1: Complete User Journey

1. **Sign Up**
   - Frontend: Fill signup form
   - Backend: User created in DB
   - ✅ Verify: User exists in MongoDB

2. **Email Verification** (if implemented)
   - Backend: Send verification email
   - User: Click verification link
   - ✅ Verify: User verified in DB

3. **Login**
   - Frontend: Login form
   - Backend: Return tokens
   - ✅ Verify: Tokens in localStorage

4. **View Profile**
   - Frontend: Request profile
   - Backend: Return user data
   - ✅ Verify: Data matches DB

5. **Upload Avatar**
   - Frontend: Select and upload file
   - Backend: Upload to Cloudinary
   - ✅ Verify: URL in DB and image on Cloudinary

6. **Update Profile**
   - Frontend: Edit and save
   - Backend: Update DB
   - ✅ Verify: Changes in DB

7. **Logout**
   - Frontend: Clear tokens
   - Backend: Invalidate session
   - ✅ Verify: Cannot access protected routes

---

### End-to-End Flow 2: Password Reset Journey

1. **Request Reset**
   - Frontend: Enter email
   - Backend: Generate token, send email
   - ✅ Verify: Token in DB, email sent

2. **Receive Email**
   - ✅ Verify: Email in inbox with correct link

3. **Click Reset Link**
   - Frontend: Load reset page with token
   - ✅ Verify: Token valid, form shown

4. **Set New Password**
   - Frontend: Submit new password
   - Backend: Hash and update password
   - ✅ Verify: Password changed in DB

5. **Login with New Password**
   - Frontend: Login form
   - Backend: Verify new password
   - ✅ Verify: Login successful

---

### End-to-End Flow 3: Admin Operations

1. **Login as Admin**
   - ✅ Verify: Admin token received

2. **Access Admin Dashboard**
   - Frontend: Load users list
   - Backend: Return all users
   - ✅ Verify: All users shown

3. **Edit User Role**
   - Frontend: Change user to admin
   - Backend: Update role in DB
   - ✅ Verify: Role updated

4. **Verify New Admin**
   - Login with updated user
   - Access admin routes
   - ✅ Verify: Can access admin features

5. **Delete User**
   - Frontend: Delete user
   - Backend: Remove from DB
   - ✅ Verify: User deleted from DB

---

## 📊 Test Results Template

### Test Session Info
- Date: [DD/MM/YYYY]
- Tester: [Name]
- Environment: Development / Production
- Backend Version: [Version]
- Frontend Version: [Version]

---

### Test Summary

| Category | Total Tests | Passed | Failed | Skipped |
|----------|-------------|--------|--------|---------|
| Authentication | 15 | 15 | 0 | 0 |
| User Management | 10 | 10 | 0 | 0 |
| Admin Features | 8 | 8 | 0 | 0 |
| Security | 5 | 5 | 0 | 0 |
| **Total** | **38** | **38** | **0** | **0** |

---

### Detailed Results

#### Authentication Tests

| Test Case | Status | Notes |
|-----------|--------|-------|
| Sign up with valid data | ✅ Pass | User created successfully |
| Sign up with duplicate email | ✅ Pass | Error message correct |
| Login with valid credentials | ✅ Pass | Tokens received |
| Login with invalid credentials | ✅ Pass | Error handled |
| Refresh token | ✅ Pass | New tokens received |
| Logout | ✅ Pass | Tokens cleared |
| Forgot password | ✅ Pass | Email sent |
| Reset password | ✅ Pass | Password updated |

#### Issues Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| 1 | Low | Button text typo | Fixed |
| 2 | Medium | Loading state not shown | Fixed |

---

### Performance Metrics

| Endpoint | Avg Response Time | Target | Status |
|----------|------------------|--------|--------|
| POST /auth/login | 150ms | <200ms | ✅ Pass |
| GET /users/profile | 80ms | <100ms | ✅ Pass |
| POST /users/upload-avatar | 1200ms | <2000ms | ✅ Pass |
| GET /users (admin) | 200ms | <300ms | ✅ Pass |

---

### Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 120+ | ✅ Pass | All features working |
| Firefox | 121+ | ✅ Pass | All features working |
| Safari | 17+ | ✅ Pass | All features working |
| Edge | 120+ | ✅ Pass | All features working |

---

### Recommendations

1. ✅ All core features working correctly
2. ✅ Security measures in place
3. ✅ Performance acceptable
4. 💡 Consider adding: Two-factor authentication
5. 💡 Consider adding: Email verification on signup

---

**Test completed successfully! ✅**

*Last updated: October 26, 2025*
