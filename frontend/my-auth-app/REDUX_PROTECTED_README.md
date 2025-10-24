# 🚀 Activity 6: Redux Toolkit & Protected Routes

## 📋 Mô tả

Activity này nâng cấp ứng dụng từ Context API lên **Redux Toolkit** để quản lý state nâng cao hơn, kết hợp với **Protected Routes** để bảo vệ các trang yêu cầu đăng nhập và phân quyền.

### 🎯 Mục tiêu hoàn thành:

✅ Cài đặt Redux Toolkit & React-Redux  
✅ Tạo Redux Store với authSlice  
✅ Migrate toàn bộ Auth logic từ Context API sang Redux  
✅ Implement Async Thunks cho API calls (login, register, logout)  
✅ Protected Routes với kiểm tra authentication & role-based access  
✅ Auto-load user từ token khi refresh page  
✅ Synchronize state giữa Redux và localStorage  

---

## 🏗️ Kiến trúc Redux

### 1. Redux Store Structure

```
src/
├── redux/
│   ├── store.js                    # Redux store configuration
│   └── slices/
│       └── authSlice.js            # Authentication slice with thunks
```

### 2. Redux Flow

```
User Action (Login/Register)
    ↓
Dispatch Async Thunk (createAsyncThunk)
    ↓
API Call (mock localStorage)
    ↓
Update Redux State (pending → fulfilled/rejected)
    ↓
Component Re-render (via useSelector)
```

---

## 🔧 Chi tiết Implementation

### 1. Install Dependencies

```bash
npm install @reduxjs/toolkit react-redux
```

**Package versions:**
- `@reduxjs/toolkit`: Latest (v2.x)
- `react-redux`: Latest (v9.x)

---

### 2. Redux Store Setup

**File: `src/redux/store.js`**

```javascript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loadUserFromToken/fulfilled'],
      },
    }),
})
```

**Giải thích:**
- `configureStore`: Setup Redux store với reducer
- `middleware`: Tắt serializableCheck warning cho token
- Single source of truth cho authentication state

---

### 3. Auth Slice với Async Thunks

**File: `src/redux/slices/authSlice.js`**

#### 📦 State Structure

```javascript
const initialState = {
  user: null,               // Current user object
  token: null,              // JWT access token
  refreshToken: null,       // Refresh token
  isAuthenticated: false,   // Authentication status
  loading: false,           // Async operation loading
  error: null,              // Error message
}
```

#### 🔄 Async Thunks

##### 1. **loginUser** - Đăng nhập

```javascript
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Mock API call - Replace with real API
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        return rejectWithValue('Email hoặc mật khẩu không đúng!')
      }

      // Check rate limiting
      const attemptKey = `loginAttempts_${email}`
      const attempts = JSON.parse(localStorage.getItem(attemptKey) || '{"count":0,"lastAttempt":0}')
      const now = Date.now()
      
      if (attempts.count >= 5 && now - attempts.lastAttempt < 60000) {
        return rejectWithValue('Quá nhiều lần thử. Vui lòng đợi 1 phút.')
      }

      // Log activity
      const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]')
      activityLog.unshift({
        id: Date.now(),
        userEmail: email,
        action: 'LOGIN',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        status: 'SUCCESS',
      })
      localStorage.setItem('activityLog', JSON.stringify(activityLog))

      // Generate tokens
      const token = `token_${Date.now()}_${Math.random()}`
      const refreshToken = `refresh_${Date.now()}_${Math.random()}`

      // Save tokens
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.removeItem(attemptKey)

      return {
        user: { email: user.email, name: user.name, role: user.role },
        token,
        refreshToken,
      }
    } catch (error) {
      return rejectWithValue('Đã xảy ra lỗi khi đăng nhập!')
    }
  }
)
```

**Lifecycle:**
- `pending`: Set loading = true
- `fulfilled`: Update user, token, isAuthenticated
- `rejected`: Set error message

##### 2. **registerUser** - Đăng ký

```javascript
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      
      // Check duplicate email
      if (users.some(u => u.email === email)) {
        return rejectWithValue('Email đã được đăng ký!')
      }

      const newUser = { 
        name, 
        email, 
        password, 
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      
      users.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(users))

      // Auto-login after register
      const token = `token_${Date.now()}_${Math.random()}`
      const refreshToken = `refresh_${Date.now()}_${Math.random()}`
      
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)

      return {
        user: { email, name, role: 'user' },
        token,
        refreshToken,
      }
    } catch (error) {
      return rejectWithValue('Đã xảy ra lỗi khi đăng ký!')
    }
  }
)
```

##### 3. **logoutUser** - Đăng xuất

```javascript
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const { user } = getState().auth
    
    // Log activity
    if (user?.email) {
      const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]')
      activityLog.unshift({
        id: Date.now(),
        userEmail: user.email,
        action: 'LOGOUT',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
      })
      localStorage.setItem('activityLog', JSON.stringify(activityLog))
    }

    // Clear tokens
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')

    return null
  }
)
```

##### 4. **loadUserFromToken** - Load user khi app init

```javascript
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        return rejectWithValue('No token found')
      }

      // Mock decode token - Replace with real JWT decode
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const lastLoggedInUser = users[users.length - 1] // Simplified logic
      
      if (!lastLoggedInUser) {
        return rejectWithValue('User not found')
      }

      return {
        user: {
          email: lastLoggedInUser.email,
          name: lastLoggedInUser.name,
          role: lastLoggedInUser.role,
        },
        token,
        refreshToken: localStorage.getItem('refreshToken'),
      }
    } catch (error) {
      return rejectWithValue('Invalid token')
    }
  }
)
```

#### 📤 Selectors

```javascript
// Select entire auth state
export const selectAuth = (state) => state.auth

// Select user object
export const selectUser = (state) => state.auth.user

// Select authentication status
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

// Select loading status
export const selectLoading = (state) => state.auth.loading

// Check if user has specific role(s)
export const selectHasRole = (roles) => (state) => {
  const user = state.auth.user
  if (!user) return false
  if (Array.isArray(roles)) return roles.includes(user.role)
  return user.role === roles
}
```

---

### 4. Migrate Components

#### App.jsx - Root Component

**Before (Context API):**
```javascript
import { useAuth } from './context/AuthProvider'

function App() {
  const { user, logout } = useAuth()
  
  return (
    <button onClick={logout}>Logout</button>
  )
}
```

**After (Redux):**
```javascript
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, selectAuth } from './redux/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  
  // Load user on app mount
  useEffect(() => {
    dispatch(loadUserFromToken())
  }, [dispatch])
  
  return (
    <button onClick={handleLogout}>Logout</button>
  )
}
```

#### Login.jsx - Login Page

```javascript
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError, selectAuth } from '../redux/slices/authSlice'

function Login() {
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector(selectAuth)
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await dispatch(loginUser({ email, password })).unwrap()
      // Auto redirect on success
    } catch (err) {
      // Error already in Redux state
    }
  }
  
  useEffect(() => {
    // Clear error on unmount
    return () => dispatch(clearError())
  }, [dispatch])
  
  useEffect(() => {
    // Redirect when authenticated
    if (isAuthenticated) {
      navigate('/profile')
    }
  }, [isAuthenticated, navigate])
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
```

#### ProtectedRoute.jsx - Route Guard

```javascript
import { useSelector } from 'react-redux'
import { selectAuth } from '../redux/slices/authSlice'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useSelector(selectAuth)
  
  if (loading) {
    return <div>Đang tải...</div>
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  
  // Check role if specified
  if (allowedRoles) {
    const hasRole = Array.isArray(allowedRoles)
      ? allowedRoles.includes(user.role)
      : user.role === allowedRoles
      
    if (!hasRole) {
      return <div>Truy cập bị từ chối</div>
    }
  }
  
  return children
}
```

---

## 🛡️ Protected Routes Setup

### Route Configuration

```javascript
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  
  {/* Protected routes - Require authentication */}
  <Route path="/profile" element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } />
  
  {/* Protected routes - Require specific role */}
  <Route path="/moderator" element={
    <ProtectedRoute allowedRoles="moderator">
      <ModeratorDashboard />
    </ProtectedRoute>
  } />
  
  <Route path="/admin" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } />
</Routes>
```

### Protection Levels

| Route | Authentication | Role | Description |
|-------|---------------|------|-------------|
| `/login`, `/signup` | ❌ No | - | Public pages |
| `/profile` | ✅ Yes | Any | Requires login only |
| `/moderator` | ✅ Yes | `moderator` | Moderator dashboard |
| `/admin` | ✅ Yes | `admin` | Admin dashboard |

---

## 🔄 Redux DevTools

### Enable Redux DevTools

Redux Toolkit automatically enables Redux DevTools in development mode.

**Cách sử dụng:**
1. Install Redux DevTools Extension:
   - Chrome: https://chrome.google.com/webstore
   - Firefox: https://addons.mozilla.org

2. Mở DevTools → Redux tab

3. Xem state changes, actions, time-travel debugging

**Features:**
- 📊 Inspect current state tree
- 🎬 Replay actions
- ⏰ Time-travel debugging
- 📈 Performance monitoring

---

## 🚀 Migration Guide: Context → Redux

### Step-by-step Migration

#### 1. Install dependencies
```bash
npm install @reduxjs/toolkit react-redux
```

#### 2. Create Redux structure
```bash
mkdir -p src/redux/slices
touch src/redux/store.js
touch src/redux/slices/authSlice.js
```

#### 3. Replace Provider in main.jsx

**Before:**
```javascript
import { AuthProvider } from './context/AuthProvider'

<AuthProvider>
  <App />
</AuthProvider>
```

**After:**
```javascript
import { Provider } from 'react-redux'
import { store } from './redux/store'

<Provider store={store}>
  <App />
</Provider>
```

#### 4. Replace hooks in components

| Context API | Redux |
|------------|-------|
| `const { user } = useAuth()` | `const user = useSelector(selectUser)` |
| `const { login } = useAuth()` | `const dispatch = useDispatch()` → `dispatch(loginUser({...}))` |
| `const { loading } = useAuth()` | `const loading = useSelector(selectLoading)` |
| `const { hasRole } = useAuth()` | `const hasRole = useSelector(selectHasRole(['admin']))` |

#### 5. Update async operations

**Before (Context):**
```javascript
const handleLogin = async () => {
  const result = await login(email, password)
  if (result.success) {
    navigate('/profile')
  }
}
```

**After (Redux):**
```javascript
const handleLogin = async () => {
  try {
    await dispatch(loginUser({ email, password })).unwrap()
    navigate('/profile')
  } catch (error) {
    // Error handled in Redux state
  }
}
```

---

## 📊 State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Login   │  │  Signup  │  │  Profile │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │              │                    │
└───────┼─────────────┼──────────────┼────────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              Redux Store (Single Source)                │
│  ┌───────────────────────────────────────────────────┐ │
│  │           Auth State (authSlice)                  │ │
│  │  - user: { email, name, role }                    │ │
│  │  - token: "jwt_token"                             │ │
│  │  - isAuthenticated: true/false                    │ │
│  │  - loading: true/false                            │ │
│  │  - error: "error message"                         │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              Async Thunks (API Layer)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │loginUser │  │register  │  │logoutUser│             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼──────────────┼────────────────────┘
        │             │              │
        ▼             ▼              ▼
┌─────────────────────────────────────────────────────────┐
│              Data Persistence                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │          localStorage (Mock Database)             │ │
│  │  - registeredUsers: [...]                         │ │
│  │  - token: "..."                                   │ │
│  │  - refreshToken: "..."                            │ │
│  │  - activityLog: [...]                             │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

- [ ] **Login Flow**
  - [ ] Đăng nhập thành công → redirect to /profile
  - [ ] Đăng nhập sai mật khẩu → show error
  - [ ] Rate limiting sau 5 lần thử → show error

- [ ] **Register Flow**
  - [ ] Đăng ký thành công → auto login → redirect
  - [ ] Email đã tồn tại → show error

- [ ] **Protected Routes**
  - [ ] Access /profile khi chưa login → redirect to /login
  - [ ] Access /admin với role user → show "Truy cập bị từ chối"
  - [ ] Access /moderator với role moderator → OK

- [ ] **Logout**
  - [ ] Logout → clear tokens → redirect to /login
  - [ ] Try access protected route after logout → redirect

- [ ] **Token Persistence**
  - [ ] Login → refresh page → still logged in
  - [ ] Clear localStorage → refresh → redirect to login

- [ ] **Redux State**
  - [ ] Check Redux DevTools shows correct state
  - [ ] Actions dispatched correctly
  - [ ] No memory leaks on unmount

---

## 🐛 Debugging Tips

### Common Issues

#### 1. **"Cannot read property 'user' of undefined"**

**Cause:** Accessing state before Redux initialized

**Fix:**
```javascript
// Always check loading state
const { user, loading } = useSelector(selectAuth)

if (loading) return <div>Loading...</div>
if (!user) return <div>Not authenticated</div>
```

#### 2. **"Actions must be plain objects"**

**Cause:** Dispatching non-serializable data

**Fix:** Use middleware config in store:
```javascript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false, // or ignore specific actions
  })
```

#### 3. **"Too many re-renders"**

**Cause:** Dispatching action inside render without dependency

**Fix:**
```javascript
// ❌ Wrong
dispatch(loadUser())

// ✅ Correct
useEffect(() => {
  dispatch(loadUser())
}, [dispatch])
```

#### 4. **Protected route không redirect**

**Cause:** isAuthenticated không update kịp

**Fix:** Check loading state:
```javascript
if (loading) return <div>Loading...</div>
if (!isAuthenticated) return <Navigate to="/login" />
```

---

## 📦 Files Modified

### Created Files
- ✅ `src/redux/store.js` - Redux store configuration
- ✅ `src/redux/slices/authSlice.js` - Auth slice with thunks

### Modified Files
- ✅ `src/main.jsx` - Replace AuthProvider with Redux Provider
- ✅ `src/App.jsx` - Use Redux hooks, load user on mount
- ✅ `src/pages/Login.jsx` - Dispatch loginUser thunk
- ✅ `src/pages/Signup.jsx` - Dispatch registerUser thunk
- ✅ `src/pages/Profile.jsx` - Use selectUser selector
- ✅ `src/pages/AdminDashboard.jsx` - Use selectUser selector
- ✅ `src/pages/ModeratorDashboard.jsx` - Use selectUser selector
- ✅ `src/components/ProtectedRoute.jsx` - Use selectAuth selector

### Removed Files
- ❌ `src/context/AuthProvider.jsx` - (Keep for reference, but not used)

---

## 🎓 Learning Points

### Why Redux Toolkit?

1. **Better State Management**
   - Single source of truth
   - Predictable state updates
   - Time-travel debugging

2. **Async Operations**
   - createAsyncThunk handles pending/fulfilled/rejected
   - No need manual loading/error state management
   - Built-in error handling

3. **Developer Experience**
   - Redux DevTools integration
   - Less boilerplate than vanilla Redux
   - TypeScript support out of the box

4. **Scalability**
   - Easy to add more slices (cart, notifications, etc.)
   - Centralized state for large apps
   - Middleware support for complex logic

### Redux vs Context API

| Feature | Context API | Redux Toolkit |
|---------|------------|---------------|
| Learning Curve | Easy | Medium |
| Performance | Re-renders all consumers | Optimized with selectors |
| DevTools | ❌ No | ✅ Yes |
| Middleware | ❌ No | ✅ Yes |
| Async Logic | Manual | createAsyncThunk |
| Best For | Small apps, simple state | Large apps, complex state |

---

## 🚀 Next Steps

### Ready for Backend Integration

Khi có backend API, chỉ cần update thunks:

```javascript
// Before (Mock)
const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
const user = users.find(u => u.email === email)

// After (Real API)
import axios from '../api/axios'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { user, token, refreshToken } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      
      return { user, token, refreshToken }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)
```

### Additional Features to Add

- [ ] Token refresh logic
- [ ] Persistent login (remember me)
- [ ] Multi-tab synchronization
- [ ] Optimistic updates
- [ ] Offline support
- [ ] More slices (notifications, cart, etc.)

---

## 📚 References

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [createAsyncThunk Guide](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

---

## ✅ Activity 6 Complete!

**Achievements:**
- ✅ Migrated to Redux Toolkit for state management
- ✅ Implemented async thunks for all auth operations
- ✅ Protected routes with role-based access control
- ✅ Token persistence and auto-load on refresh
- ✅ Better developer experience with DevTools
- ✅ Scalable architecture for future features

**Student:** SV2 (Frontend Developer)  
**Date:** 2024  
**Branch:** `feature/redux-protected`  
