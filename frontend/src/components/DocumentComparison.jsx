import React, { useState, useEffect } from 'react'

export default function DocumentComparison({ documents = [] }) {
  const [selectedDocs, setSelectedDocs] = useState([null, null])
  const [comparison, setComparison] = useState(null)

  const handleDocumentSelect = (index, docId) => {
    const newSelected = [...selectedDocs]
    newSelected[index] = documents.find(d => d._id === docId)
    setSelectedDocs(newSelected)
  }

  useEffect(() => {
    if (selectedDocs[0] && selectedDocs[1]) {
      // Generate comparison
      const doc1 = selectedDocs[0]
      const doc2 = selectedDocs[1]
      
      const similarities = []
      const differences = []
      
      // Compare entities
      const entities1 = doc1.entities || []
      const entities2 = doc2.entities || []
      
      const commonEntities = entities1.filter(e1 => 
        entities2.some(e2 => e2.value.toLowerCase() === e1.value.toLowerCase())
      )
      
      if (commonEntities.length > 0) {
        similarities.push(`Both documents contain: ${commonEntities.map(e => e.value).join(', ')}`)
      }
      
      // Compare document types (based on filename)
      if (doc1.filename.includes('contract') && doc2.filename.includes('contract')) {
        similarities.push('Both are contract documents')
      }
      
      // Word count comparison
      const words1 = (doc1.originalText || '').split(/\s+/).length
      const words2 = (doc2.originalText || '').split(/\s+/).length
      const wordDiff = Math.abs(words1 - words2)
      
      if (wordDiff > 500) {
        differences.push(`Significant length difference: ${wordDiff} words`)
      }
      
      // Entity type comparison
      const types1 = [...new Set(entities1.map(e => e.type))]
      const types2 = [...new Set(entities2.map(e => e.type))]
      const uniqueTypes1 = types1.filter(t => !types2.includes(t))
      const uniqueTypes2 = types2.filter(t => !types1.includes(t))
      
      if (uniqueTypes1.length > 0) {
        differences.push(`${doc1.filename} contains unique entity types: ${uniqueTypes1.join(', ')}`)
      }
      if (uniqueTypes2.length > 0) {
        differences.push(`${doc2.filename} contains unique entity types: ${uniqueTypes2.join(', ')}`)
      }
      
      setComparison({
        similarities,
        differences,
        stats: {
          doc1: { words: words1, entities: entities1.length, types: types1.length },
          doc2: { words: words2, entities: entities2.length, types: types2.length }
        }
      })
    } else {
      setComparison(null)
    }
  }, [selectedDocs])

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h3>⚖️ Document Comparison</h3>
        <p>Compare two documents to identify similarities and differences</p>
      </div>

      <div className="document-selectors">
        <div className="selector-group">
          <label>Document 1:</label>
          <select 
            value={selectedDocs[0]?._id || ''} 
            onChange={(e) => handleDocumentSelect(0, e.target.value)}
          >
            <option value="">Select a document...</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.filename}</option>
            ))}
          </select>
        </div>
        
        <div className="vs-divider">VS</div>
        
        <div className="selector-group">
          <label>Document 2:</label>
          <select 
            value={selectedDocs[1]?._id || ''} 
            onChange={(e) => handleDocumentSelect(1, e.target.value)}
          >
            <option value="">Select a document...</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.filename}</option>
            ))}
          </select>
        </div>
      </div>

      {comparison && (
        <div className="comparison-results">
          <div className="comparison-stats">
            <div className="stat-comparison">
              <h4>📊 Quick Stats</h4>
              <div className="stats-table">
                <div className="stats-row header">
                  <span>Metric</span>
                  <span>{selectedDocs[0].filename}</span>
                  <span>{selectedDocs[1].filename}</span>
                </div>
                <div className="stats-row">
                  <span>Word Count</span>
                  <span>{comparison.stats.doc1.words.toLocaleString()}</span>
                  <span>{comparison.stats.doc2.words.toLocaleString()}</span>
                </div>
                <div className="stats-row">
                  <span>Entities</span>
                  <span>{comparison.stats.doc1.entities}</span>
                  <span>{comparison.stats.doc2.entities}</span>
                </div>
                <div className="stats-row">
                  <span>Entity Types</span>
                  <span>{comparison.stats.doc1.types}</span>
                  <span>{comparison.stats.doc2.types}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="comparison-analysis">
            <div className="similarities-section">
              <h4>✅ Similarities</h4>
              {comparison.similarities.length > 0 ? (
                <ul>
                  {comparison.similarities.map((sim, index) => (
                    <li key={index}>{sim}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No significant similarities found</p>
              )}
            </div>

            <div className="differences-section">
              <h4>❌ Differences</h4>
              {comparison.differences.length > 0 ? (
                <ul>
                  {comparison.differences.map((diff, index) => (
                    <li key={index}>{diff}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No significant differences found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!comparison && (
        <div className="comparison-empty">
          <p>Select two documents to compare them</p>
        </div>
      )}
    </div>
  )
}