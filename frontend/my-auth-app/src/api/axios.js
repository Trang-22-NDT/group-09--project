import axios from 'axios'

const API_BASE = 'http://localhost:5000' // <-- đổi theo backend của bạn

const instance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

let isRefreshing = false
let refreshSubscribers = []

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}
function addRefreshSubscriber(cb) { refreshSubscribers.push(cb) }

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (!originalRequest || originalRequest._retry) return Promise.reject(error)

    if (error.response && error.response.status === 401) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return Promise.reject(error)

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
        const resp = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken }, {
          headers: { 'Content-Type': 'application/json' }
        })
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = resp.data

        if (!newAccessToken) {
          onRefreshed(null)
          isRefreshing = false
          return Promise.reject(error)
        }

        localStorage.setItem('accessToken', newAccessToken)
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)

        instance.defaults.headers.Authorization = `Bearer ${newAccessToken}`
        onRefreshed(newAccessToken)
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return instance(originalRequest)
      } catch (err) {
        onRefreshed(null)
        isRefreshing = false
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default instance