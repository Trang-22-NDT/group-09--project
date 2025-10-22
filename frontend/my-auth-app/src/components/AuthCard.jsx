import React from 'react'

export default function AuthCard({ title, children, footer }) {
  return (
    <div className="center-wrap">
      <div className="card">
        <h2 className="card-title">{title}</h2>
        <div className="card-body">{children}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </div>
  )
}