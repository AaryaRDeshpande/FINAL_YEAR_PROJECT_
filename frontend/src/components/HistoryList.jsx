import React from 'react'

export default function HistoryList({ items, onSelect, onDelete }) {
  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevent triggering onSelect
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDelete(id);
    }
  };

  return (
    <div className="history-card">
      <h3>📚 Recent Documents</h3>
      {items.length === 0 ? (
        <div className="history-empty">
          <p>No documents processed yet.</p>
          <p>Upload your first document to get started!</p>
        </div>
      ) : (
        <div className="history-list">
          {items.map((d) => (
            <div 
              key={d._id} 
              className="history-item"
              onClick={() => onSelect(d._id)}
            >
              <div className="history-item-content">
                <div className="history-item-name">{d.filename}</div>
                <div className="history-item-date">
                  {new Date(d.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="history-item-actions">
                <span className="badge">{d.status}</span>
                <button 
                  className="btn danger" 
                  onClick={(e) => handleDelete(e, d._id)}
                  style={{padding: '6px 10px', fontSize: '12px'}}
                  title="Delete document"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
