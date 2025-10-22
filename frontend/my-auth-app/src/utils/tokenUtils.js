// Token Management Utilities

/**
 * Lưu tokens vào localStorage
 */
export const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('tokenSavedAt', new Date().toISOString())
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

/**
 * Lấy tokens từ localStorage
 */
export const getTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    tokenSavedAt: localStorage.getItem('tokenSavedAt')
  }
}

/**
 * Xóa tất cả tokens
 */
export const clearTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('tokenSavedAt')
  localStorage.removeItem('lastRefreshTime')
}

/**
 * Kiểm tra xem token có hợp lệ không
 */
export const isTokenValid = () => {
  const accessToken = localStorage.getItem('accessToken')
  return !!accessToken
}

/**
 * Lấy thời gian token được lưu
 */
export const getTokenAge = () => {
  const tokenSavedAt = localStorage.getItem('tokenSavedAt')
  if (!tokenSavedAt) return null
  
  const savedTime = new Date(tokenSavedAt)
  const now = new Date()
  const ageInSeconds = Math.floor((now - savedTime) / 1000)
  
  return {
    seconds: ageInSeconds,
    minutes: Math.floor(ageInSeconds / 60),
    formatted: formatTokenAge(ageInSeconds)
  }
}

/**
 * Format thời gian token
 */
const formatTokenAge = (seconds) => {
  if (seconds < 60) return `${seconds} giây`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  return `${hours} giờ ${minutes % 60} phút`
}

/**
 * Lấy thời gian refresh token lần cuối
 */
export const getLastRefreshTime = () => {
  const lastRefresh = localStorage.getItem('lastRefreshTime')
  if (!lastRefresh) return null
  return new Date(lastRefresh)
}
