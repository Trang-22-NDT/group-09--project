import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'
import { saveTokens, clearTokens, getTokens } from '../../utils/tokenUtils'

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Async thunks

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Mock login cho development (sẽ thay bằng API thật)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const user = registeredUsers.find(u => u.email === email)
      
      if (!user) {
        return rejectWithValue('Email không tồn tại')
      }
      
      if (user.password !== password) {
        return rejectWithValue('Mật khẩu không đúng')
      }
      
      // Mock token
      const mockToken = `mock-jwt-token-${Date.now()}`
      const mockRefreshToken = `mock-refresh-token-${Date.now()}`
      
      // Save tokens
      saveTokens(mockToken, mockRefreshToken)
      
      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user
      
      return {
        user: userWithoutPassword,
        token: mockToken
      }
      
      // Real API call (uncomment when backend ready)
      // const response = await api.post('/auth/login', { email, password })
      // saveTokens(response.data.token, response.data.refreshToken)
      // return response.data
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại')
    }
  }
)

// Register thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Mock register
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      
      // Check if email exists
      if (registeredUsers.find(u => u.email === email)) {
        return rejectWithValue('Email đã được sử dụng')
      }
      
      const newUser = {
        name,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString()
      }
      
      registeredUsers.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
      
      // Mock token
      const mockToken = `mock-jwt-token-${Date.now()}`
      const mockRefreshToken = `mock-refresh-token-${Date.now()}`
      
      saveTokens(mockToken, mockRefreshToken)
      
      const { password: _, ...userWithoutPassword } = newUser
      
      return {
        user: userWithoutPassword,
        token: mockToken
      }
      
      // Real API call (uncomment when backend ready)
      // const response = await api.post('/auth/register', { name, email, password })
      // saveTokens(response.data.token, response.data.refreshToken)
      // return response.data
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại')
    }
  }
)

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      clearTokens()
      
      // Real API call (uncomment when backend ready)
      // await api.post('/auth/logout')
      
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng xuất thất bại')
    }
  }
)

// Load user from token (on app init)
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const { token } = getTokens()
      
      if (!token) {
        return rejectWithValue('No token found')
      }
      
      // Mock: Get user from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      // For demo, get last logged in user
      const currentUserEmail = localStorage.getItem('currentUserEmail')
      const user = registeredUsers.find(u => u.email === currentUserEmail)
      
      if (!user) {
        clearTokens()
        return rejectWithValue('User not found')
      }
      
      const { password: _, ...userWithoutPassword } = user
      
      return {
        user: userWithoutPassword,
        token
      }
      
      // Real API call (uncomment when backend ready)
      // const response = await api.get('/auth/me')
      // return { user: response.data, token }
      
    } catch (error) {
      clearTokens()
      return rejectWithValue(error.response?.data?.message || 'Failed to load user')
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        
        // Store current user email for reload
        localStorage.setItem('currentUserEmail', action.payload.user.email)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })
    
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        
        localStorage.setItem('currentUserEmail', action.payload.user.email)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })
    
    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = null
        
        localStorage.removeItem('currentUserEmail')
      })
    
    // Load user
    builder
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  }
})

// Export actions
export const { clearError, updateUser } = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error

// Helper function to check user role
export const selectHasRole = (roles) => (state) => {
  const user = state.auth.user
  if (!user) return false
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role)
  }
  return user.role === roles
}

export default authSlice.reducer
