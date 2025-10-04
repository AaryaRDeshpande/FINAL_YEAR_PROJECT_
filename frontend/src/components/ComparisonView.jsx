import React from 'react'

export default function ComparisonView({ original, simplified }) {
  if (!original && !simplified) {
    return (
      <div className="comparison-container">
        <div className="comparison-header">
          <h3>📄 Document Comparison</h3>
          <p>Upload and process a document to see the comparison between original and simplified text</p>
        </div>
        <div className="comparison-empty">
          <p>No document selected for comparison</p>
        </div>
      </div>
    )
  }

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h3>📄 Document Comparison</h3>
        <p>Compare the original legal text with our AI-simplified version</p>
      </div>
      <div className="comparison-grid">
        <div className="comparison-panel">
          <h4>📋 Original Text</h4>
          {original ? (
            <div className="comparison-text">{original}</div>
          ) : (
            <div className="comparison-empty">No original text available</div>
          )}
        </div>
        <div className="comparison-panel">
          <h4>✨ Simplified Text</h4>
          {simplified ? (
            <div className="comparison-text">{simplified}</div>
          ) : (
            <div className="comparison-empty">No simplified text available</div>
          )}
        </div>
      </div>
    </div>
  )
}
