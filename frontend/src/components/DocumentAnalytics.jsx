import React, { useState, useEffect } from 'react'

export default function DocumentAnalytics({ document, entities = [] }) {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (!document) {
      setAnalytics(null)
      return
    }

    // Calculate analytics
    const calculateAnalytics = () => {
      const text = document.originalText || ''
      const simplified = document.simplifiedText || ''
      
      // Basic metrics
      const wordCount = text.split(/\s+/).length
      const sentenceCount = text.split(/[.!?]+/).length
      const paragraphCount = text.split(/\n\s*\n/).length
      
      // Complexity analysis
      const avgWordsPerSentence = wordCount / sentenceCount
      const complexityScore = Math.min(10, Math.max(1, Math.round(avgWordsPerSentence / 3)))
      
      // Risk assessment (based on certain keywords)
      const riskKeywords = [
        'liability', 'penalty', 'breach', 'termination', 'damages', 'indemnify',
        'sue', 'lawsuit', 'court', 'arbitration', 'dispute', 'violation'
      ]
      const riskCount = riskKeywords.filter(keyword => 
        text.toLowerCase().includes(keyword)
      ).length
      const riskScore = Math.min(10, Math.max(1, riskCount + 1))
      
      // Entity analysis
      const entityTypes = [...new Set(entities.map(e => e.type))]
      const entityCounts = entityTypes.reduce((acc, type) => {
        acc[type] = entities.filter(e => e.type === type).length
        return acc
      }, {})
      
      // Readability improvement
      const originalWords = text.split(/\s+/).length
      const simplifiedWords = simplified.split(/\s+/).length
      const readabilityImprovement = originalWords > 0 ? 
        Math.round(((originalWords - simplifiedWords) / originalWords) * 100) : 0
      
      // Key insights
      const insights = []
      if (complexityScore > 7) {
        insights.push({ type: 'warning', text: 'High complexity document - may need expert review' })
      }
      if (riskScore > 5) {
        insights.push({ type: 'danger', text: 'Contains high-risk legal terms' })
      }
      if (readabilityImprovement > 30) {
        insights.push({ type: 'success', text: 'Significant readability improvement achieved' })
      }
      if (entities.length > 20) {
        insights.push({ type: 'info', text: 'Document contains many entities - complex agreement' })
      }
      
      return {
        wordCount,
        sentenceCount,
        paragraphCount,
        avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
        complexityScore,
        riskScore,
        entityCounts,
        readabilityImprovement,
        insights,
        processingTime: '2.3s', // Mock processing time
        confidence: Math.round(85 + Math.random() * 10) // Mock confidence score
      }
    }

    setAnalytics(calculateAnalytics())
  }, [document, entities])

  if (!document || !analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h3>📊 Document Analytics</h3>
          <p>Upload and process a document to see detailed analytics</p>
        </div>
        <div className="analytics-empty">
          <p>No document selected for analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h3>📊 Document Analytics</h3>
        <p>Comprehensive analysis of your legal document</p>
      </div>

      <div className="analytics-grid">
        {/* Basic Metrics */}
        <div className="analytics-card">
          <h4>📝 Document Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-value">{analytics.wordCount.toLocaleString()}</span>
              <span className="metric-label">Words</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{analytics.sentenceCount}</span>
              <span className="metric-label">Sentences</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{analytics.paragraphCount}</span>
              <span className="metric-label">Paragraphs</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{analytics.avgWordsPerSentence}</span>
              <span className="metric-label">Avg Words/Sentence</span>
            </div>
          </div>
        </div>

        {/* Complexity & Risk */}
        <div className="analytics-card">
          <h4>⚠️ Complexity & Risk</h4>
          <div className="score-items">
            <div className="score-item">
              <div className="score-label">Complexity Score</div>
              <div className="score-bar">
                <div 
                  className="score-fill complexity" 
                  style={{ width: `${analytics.complexityScore * 10}%` }}
                ></div>
                <span className="score-value">{analytics.complexityScore}/10</span>
              </div>
            </div>
            <div className="score-item">
              <div className="score-label">Risk Level</div>
              <div className="score-bar">
                <div 
                  className="score-fill risk" 
                  style={{ width: `${analytics.riskScore * 10}%` }}
                ></div>
                <span className="score-value">{analytics.riskScore}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entity Breakdown */}
        <div className="analytics-card">
          <h4>🏷️ Entity Breakdown</h4>
          <div className="entity-breakdown">
            {Object.entries(analytics.entityCounts).map(([type, count]) => (
              <div key={type} className="entity-type-item">
                <span className="entity-type-name">{type}</span>
                <span className="entity-type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Info */}
        <div className="analytics-card">
          <h4>⚡ Processing Info</h4>
          <div className="processing-info">
            <div className="info-item">
              <span className="info-label">Processing Time:</span>
              <span className="info-value">{analytics.processingTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Confidence Score:</span>
              <span className="info-value">{analytics.confidence}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Readability Improvement:</span>
              <span className="info-value">{analytics.readabilityImprovement}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {analytics.insights.length > 0 && (
        <div className="analytics-insights">
          <h4>💡 Key Insights</h4>
          <div className="insights-list">
            {analytics.insights.map((insight, index) => (
              <div key={index} className={`insight-item ${insight.type}`}>
                <span className="insight-icon">
                  {insight.type === 'warning' && '⚠️'}
                  {insight.type === 'danger' && '🚨'}
                  {insight.type === 'success' && '✅'}
                  {insight.type === 'info' && 'ℹ️'}
                </span>
                <span className="insight-text">{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}