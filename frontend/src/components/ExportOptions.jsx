import React, { useState } from 'react'

export default function ExportOptions({ document, entities = [] }) {
  const [exportFormat, setExportFormat] = useState('pdf')
  const [includeOptions, setIncludeOptions] = useState({
    original: true,
    simplified: true,
    entities: true,
    analytics: false
  })

  const handleExport = (format) => {
    if (!document) return

    const exportData = {
      filename: document.filename,
      timestamp: new Date().toISOString(),
      ...(includeOptions.original && { originalText: document.originalText }),
      ...(includeOptions.simplified && { simplifiedText: document.simplifiedText }),
      ...(includeOptions.entities && { entities }),
      ...(includeOptions.analytics && { 
        wordCount: (document.originalText || '').split(/\s+/).length,
        entityCount: entities.length
      })
    }

    switch (format) {
      case 'json':
        downloadJSON(exportData)
        break
      case 'txt':
        downloadTXT(exportData)
        break
      case 'pdf':
        generatePDF(exportData)
        break
      case 'csv':
        downloadCSV(exportData)
        break
    }
  }

  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${document.filename}_analysis.json`)
  }

  const downloadTXT = (data) => {
    let content = `Document Analysis: ${data.filename}\n`
    content += `Generated: ${new Date(data.timestamp).toLocaleString()}\n\n`
    
    if (data.originalText) {
      content += `ORIGINAL TEXT:\n${data.originalText}\n\n`
    }
    
    if (data.simplifiedText) {
      content += `SIMPLIFIED TEXT:\n${data.simplifiedText}\n\n`
    }
    
    if (data.entities) {
      content += `ENTITIES:\n`
      data.entities.forEach(entity => {
        content += `- ${entity.type}: ${entity.value}\n`
      })
    }

    const blob = new Blob([content], { type: 'text/plain' })
    downloadBlob(blob, `${document.filename}_analysis.txt`)
  }

  const downloadCSV = (data) => {
    if (!data.entities) return
    
    let csv = 'Type,Value\n'
    data.entities.forEach(entity => {
      csv += `"${entity.type}","${entity.value}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    downloadBlob(blob, `${document.filename}_entities.csv`)
  }

  const generatePDF = (data) => {
    // For now, we'll create a simple HTML version that can be printed as PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Document Analysis - ${data.filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #475569; margin-top: 30px; }
          .meta { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .entity { background: #e0f2fe; padding: 5px 10px; margin: 2px; border-radius: 4px; display: inline-block; }
          .original { background: #fef7cd; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .simplified { background: #d1fae5; padding: 15px; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Legal Document Analysis</h1>
        <div class="meta">
          <strong>Document:</strong> ${data.filename}<br>
          <strong>Generated:</strong> ${new Date(data.timestamp).toLocaleString()}
        </div>
        
        ${data.originalText ? `<h2>Original Text</h2><div class="original">${data.originalText}</div>` : ''}
        
        ${data.simplifiedText ? `<h2>Simplified Text</h2><div class="simplified">${data.simplifiedText}</div>` : ''}
        
        ${data.entities ? `
          <h2>Extracted Entities</h2>
          <div>
            ${data.entities.map(e => `<span class="entity"><strong>${e.type}:</strong> ${e.value}</span>`).join(' ')}
          </div>
        ` : ''}
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const newWindow = window.open(url, '_blank')
    newWindow.onload = () => {
      newWindow.print()
    }
  }

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareDocument = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Legal Document Analysis - ${document.filename}`,
          text: document.simplifiedText || 'Document analysis completed',
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (!document) {
    return (
      <div className="export-container">
        <div className="export-header">
          <h3>📤 Export & Share</h3>
          <p>Process a document to enable export options</p>
        </div>
        <div className="export-empty">
          <p>No document available for export</p>
        </div>
      </div>
    )
  }

  return (
    <div className="export-container">
      <div className="export-header">
        <h3>📤 Export & Share</h3>
        <p>Download your document analysis in various formats</p>
      </div>

      <div className="export-options">
        <div className="include-options">
          <h4>Include in Export:</h4>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeOptions.original}
                onChange={(e) => setIncludeOptions({...includeOptions, original: e.target.checked})}
              />
              Original Text
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeOptions.simplified}
                onChange={(e) => setIncludeOptions({...includeOptions, simplified: e.target.checked})}
              />
              Simplified Text
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeOptions.entities}
                onChange={(e) => setIncludeOptions({...includeOptions, entities: e.target.checked})}
              />
              Entities
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeOptions.analytics}
                onChange={(e) => setIncludeOptions({...includeOptions, analytics: e.target.checked})}
              />
              Analytics
            </label>
          </div>
        </div>

        <div className="export-buttons">
          <button className="export-btn pdf" onClick={() => handleExport('pdf')}>
            📄 Export as PDF
          </button>
          <button className="export-btn json" onClick={() => handleExport('json')}>
            📋 Export as JSON
          </button>
          <button className="export-btn txt" onClick={() => handleExport('txt')}>
            📝 Export as TXT
          </button>
          <button className="export-btn csv" onClick={() => handleExport('csv')}>
            📊 Export Entities (CSV)
          </button>
        </div>

        <div className="share-section">
          <button className="share-btn" onClick={shareDocument}>
            🔗 Share Analysis
          </button>
        </div>
      </div>
    </div>
  )
}