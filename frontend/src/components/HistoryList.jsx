import React from 'react'

export default function HistoryList({ items, onSelect }) {
  return (
    <div className="card">
      <div className="header"><h3>Recent Documents</h3><span className="badge">History</span></div>
      <div className="list">
        {items.length === 0 && <div className="muted">No documents yet.</div>}
        {items.map((d) => (
          <button key={d._id} className="list-item btn secondary" onClick={() => onSelect(d._id)}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
              <span>{d.filename}</span>
              <span className="badge">{d.status}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
