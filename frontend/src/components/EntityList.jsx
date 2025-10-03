import React from 'react'

export default function EntityList({ entities }) {
  if (!entities || entities.length === 0) return (
    <div className="card"><p className="muted">No entities detected yet.</p></div>
  )
  return (
    <div className="card">
      <div className="header"><h3>Entities</h3><span className="badge">Detected</span></div>
      <div className="list">
        {entities.map((e, i) => (
          <div key={i} className="list-item">
            <strong>{e.type}</strong>: {e.value}
          </div>
        ))}
      </div>
    </div>
  )
}
