import axios from 'axios'

const API_BASE = 'http://localhost:5000' // <-- đổi theo backend của bạn

const instance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Request Interceptor - Thêm Access Token vào header
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

let isRefreshing = false
let refreshSubscribers = []

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(cb) { 
  refreshSubscribers.push(cb) 
}

// Response Interceptor - Tự động refresh token khi 401
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    
    // Nếu không có originalRequest hoặc đã retry rồi
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Nếu lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response && error.response.status === 401) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        // Không có refresh token, redirect về login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Nếu đang refresh token, thêm request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            if (!token) return reject(error)
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(instance(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        // Gọi API refresh token
        const resp = await axios.post(`${API_BASE}/auth/refresh`, 
          { refreshToken }, 
          { headers: { 'Content-Type': 'application/json' } }
        )
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = resp.data

        if (!newAccessToken) {
          onRefreshed(null)
          isRefreshing = false
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Lưu token mới
        localStorage.setItem('accessToken', newAccessToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        // Lưu thời gian refresh
        localStorage.setItem('lastRefreshTime', new Date().toISOString())

        // Cập nhật header mặc định
        instance.defaults.headers.Authorization = `Bearer ${newAccessToken}`
        
        // Thông báo cho các request đang đợi
        onRefreshed(newAccessToken)
        isRefreshing = false

        // Retry request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return instance(originalRequest)
        
      } catch (err) {
        console.error('Refresh token failed:', err)
        onRefreshed(null)
        isRefreshing = false
        
        // Xóa token và redirect về login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default instance