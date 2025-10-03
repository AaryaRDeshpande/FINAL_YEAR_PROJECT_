import React from 'react'

export default function ComparisonView({ original, simplified }) {
  return (
    <div className="grid">
      <div className="card">
        <div className="header"><h3>Original</h3><span className="badge">Source</span></div>
        <textarea className="textarea" value={original || ''} readOnly />
      </div>
      <div className="card">
        <div className="header"><h3>Plain Language</h3><span className="badge">Simplified</span></div>
        <textarea className="textarea" value={simplified || ''} readOnly />
      </div>
    </div>
  )
}
