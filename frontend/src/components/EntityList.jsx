import React from 'react'

export default function EntityList({ entities }) {
  return (
    <div className="entity-container">
      <div className="entity-header">
        <h3>🔍 Extracted Entities</h3>
        <p>Key legal entities, dates, and important information identified in your document</p>
      </div>
      
      {!entities || entities.length === 0 ? (
        <div className="entity-empty">
          <p>No entities detected yet.</p>
          <p>Process a document to see extracted legal entities, dates, and key information.</p>
        </div>
      ) : (
        <div className="entity-grid">
          {entities.map((e, i) => (
            <div key={i} className="entity-item">
              <div className="entity-type">{e.type}</div>
              <div className="entity-text">{e.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
