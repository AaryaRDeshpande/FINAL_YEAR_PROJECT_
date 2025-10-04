import React from 'react'

export default function HistoryList({ items, onSelect, onDelete }) {
  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevent triggering onSelect
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDelete(id);
    }
  };

  return (
    <div className="card">
      <div className="header"><h3>Recent Documents</h3><span className="badge">History</span></div>
      <div className="list">
        {items.length === 0 && <div className="muted">No documents yet.</div>}
        {items.map((d) => (
          <div key={d._id} className="list-item" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px',border:'1px solid #ddd',borderRadius:'8px',marginBottom:'8px'}}>
            <button 
              className="btn secondary" 
              onClick={() => onSelect(d._id)}
              style={{flex:1,textAlign:'left',border:'none',background:'none',padding:'0'}}
            >
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                <span>{d.filename}</span>
                <span className="badge">{d.status}</span>
              </div>
            </button>
            <button 
              className="btn danger" 
              onClick={(e) => handleDelete(e, d._id)}
              style={{marginLeft:'8px',padding:'4px 8px',fontSize:'12px'}}
              title="Delete document"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
