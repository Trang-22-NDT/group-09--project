import React, { useState, useEffect } from 'react'
import { getTokenAge, getLastRefreshTime, isTokenValid } from '../utils/tokenUtils'

export default function TokenStatus() {
  const [tokenInfo, setTokenInfo] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  useEffect(() => {
    const updateTokenInfo = () => {
      if (isTokenValid()) {
        const age = getTokenAge()
        const refresh = getLastRefreshTime()
        setTokenInfo(age)
        setLastRefresh(refresh)
      } else {
        setTokenInfo(null)
        setLastRefresh(null)
      }
    }

    updateTokenInfo()
    const interval = setInterval(updateTokenInfo, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  if (!tokenInfo) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
      <h3 className="text-sm font-bold text-gray-700 mb-2">🔐 Token Status</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Token Age:</span>
          <span className="font-semibold text-blue-600">{tokenInfo.formatted}</span>
        </div>
        
        {lastRefresh && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last Refresh:</span>
            <span className="font-semibold text-green-600">
              {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
