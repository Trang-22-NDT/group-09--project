import React, { useState, useEffect } from 'react'

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    // Load avatar from localStorage theo email của user
    if (user?.email) {
      const savedAvatar = localStorage.getItem(`userAvatar_${user.email}`)
      if (savedAvatar) {
        setAvatar(savedAvatar)
      }
    }
  }, [user])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${className}`}>
      {avatar ? (
        <img 
          src={avatar} 
          alt={user?.name || 'User'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <svg className={`${iconSizes[size]} text-white`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  )
}
